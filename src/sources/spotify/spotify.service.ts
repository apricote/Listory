import { Injectable, Logger } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { ListensService } from "../../listens/listens.service";
import { Album } from "../../music-library/album.entity";
import { Artist } from "../../music-library/artist.entity";
import { Genre } from "../../music-library/genre.entity";
import { MusicLibraryService } from "../../music-library/music-library.service";
import { Track } from "../../music-library/track.entity";
import { User } from "../../users/user.entity";
import { UsersService } from "../../users/users.service";
import {
  IImportSpotifyJob,
  ImportSpotifyJob,
  UpdateSpotifyLibraryJob,
} from "../jobs";
import { AlbumObject } from "./spotify-api/entities/album-object";
import { ArtistObject } from "./spotify-api/entities/artist-object";
import { PlayHistoryObject } from "./spotify-api/entities/play-history-object";
import { TrackObject } from "./spotify-api/entities/track-object";
import { SpotifyApiService } from "./spotify-api/spotify-api.service";
import { SpotifyAuthService } from "./spotify-auth/spotify-auth.service";

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(this.constructor.name);

  private appAccessToken: string | null;
  private appAccessTokenInProgress: Promise<void> | null;

  constructor(
    private readonly usersService: UsersService,
    private readonly listensService: ListensService,
    private readonly musicLibraryService: MusicLibraryService,
    private readonly spotifyApi: SpotifyApiService,
    private readonly spotifyAuth: SpotifyAuthService
  ) {}

  @Span()
  async getCrawlableUserInfo(): Promise<{ user: User; lastListen: Date }[]> {
    // All of this is kinda inefficient, we do two db queries and join in code,
    // i can't be bothered to do this properly in the db for now.
    // Should be refactored if listory gets hundreds of users (lol).

    const [users, listens] = await Promise.all([
      this.usersService.findAll(),
      this.listensService.getMostRecentListenPerUser(),
    ]);

    return users.map((user) => {
      const lastListen = listens.find((listen) => listen.user.id === user.id);

      return {
        user,
        // Return 1970 if no listen exists
        lastListen: lastListen ? lastListen.playedAt : new Date(0),
      };
    });

    return;
  }

  @ImportSpotifyJob.Handle()
  async importSpotifyJobHandler({ userID }: IImportSpotifyJob): Promise<void> {
    const user = await this.usersService.findById(userID);
    if (!user) {
      this.logger.warn("User for import job not found", { userID });
      return;
    }

    await this.crawlListensForUser(user);
  }

  @Span()
  async crawlListensForUser(
    user: User,
    retryOnExpiredToken: boolean = true
  ): Promise<void> {
    this.logger.debug({ userId: user.id }, `Crawling recently played tracks`);

    let playHistory: PlayHistoryObject[];
    try {
      playHistory = await this.spotifyApi.getRecentlyPlayedTracks(user.spotify);
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        try {
          const accessToken = await this.spotifyAuth.refreshAccessToken(
            user.spotify
          );
          await this.usersService.updateSpotifyConnection(user, {
            ...user.spotify,
            accessToken,
          });
          await this.crawlListensForUser(user, false);
        } catch (errFromAuth) {
          this.logger.error(
            { userId: user.id },
            `Refreshing access token failed for user "${user.id}": ${errFromAuth}`
          );
        }
      } else {
        // TODO sent to sentry
        this.logger.error(
          `Unexpected error while fetching recently played tracks: ${err}`
        );
      }

      // Makes no sense to keep processing the (inexistent) data but if we throw
      // the error the fetch loop will not process other users.
      return;
    }

    if (playHistory.length === 0) {
      return;
    }

    await Promise.all(
      playHistory.map(async (history) => {
        const track = await this.importTrack(history.track.id);

        const { isDuplicate } = await this.listensService.createListen({
          user,
          track,
          playedAt: new Date(history.played_at),
        });

        if (!isDuplicate) {
          this.logger.debug(
            { userId: user.id },
            `New listen found! ${user.id} listened to "${
              track.name
            }" by ${track.artists
              ?.map((artist) => `"${artist.name}"`)
              .join(", ")}`
          );
        }
      })
    );

    const newestPlayTime = new Date(
      playHistory
        .map((history) => history.played_at)
        .sort()
        .pop()
    );

    /**
     * lastRefreshTime was previously used to only get new listens from Spotify
     * but the Spotify WEB Api was sometimes not adding the listens in the right
     * order, causing us to miss some listens.
     *
     * The variable will still be set, in case we want to add the functionality
     * again.
     */
    await this.usersService.updateSpotifyConnection(user, {
      ...user.spotify,
      lastRefreshTime: newestPlayTime,
    });
  }

  @Span()
  @UpdateSpotifyLibraryJob.Handle()
  async runUpdaterForAllEntities(): Promise<void> {
    this.logger.debug("Starting Spotify updater loop");

    const oldestArtist =
      await this.musicLibraryService.getArtistWithOldestUpdate();

    if (oldestArtist) {
      await this.updateArtist(oldestArtist.spotify.id);
    }
  }

  @Span()
  async importTrack(
    spotifyID: string,
    retryOnExpiredToken: boolean = true
  ): Promise<Track> {
    const track = await this.musicLibraryService.findTrack({
      spotify: { id: spotifyID },
    });
    if (track) {
      return track;
    }

    let spotifyTrack: TrackObject;

    try {
      spotifyTrack = await this.spotifyApi.getTrack(
        this.appAccessToken,
        spotifyID
      );
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        await this.refreshAppAccessToken();

        return this.importTrack(spotifyID, false);
      }

      throw err;
    }

    const [album, artists] = await Promise.all([
      this.importAlbum(spotifyTrack.album.id),
      Promise.all(
        spotifyTrack.artists.map(({ id: artistID }) =>
          this.importArtist(artistID)
        )
      ),
    ]);

    return this.musicLibraryService.createTrack({
      name: spotifyTrack.name,
      album,
      artists,
      spotify: {
        id: spotifyTrack.id,
        uri: spotifyTrack.uri,
        type: spotifyTrack.type,
        href: spotifyTrack.href,
      },
    });
  }

  @Span()
  async importAlbum(
    spotifyID: string,
    retryOnExpiredToken: boolean = true
  ): Promise<Album> {
    const album = await this.musicLibraryService.findAlbum({
      spotify: { id: spotifyID },
    });
    if (album) {
      return album;
    }

    let spotifyAlbum: AlbumObject;

    try {
      spotifyAlbum = await this.spotifyApi.getAlbum(
        this.appAccessToken,
        spotifyID
      );
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        await this.refreshAppAccessToken();

        return this.importAlbum(spotifyID, false);
      }

      throw err;
    }

    const artists = await Promise.all(
      spotifyAlbum.artists.map(({ id: artistID }) =>
        this.importArtist(artistID)
      )
    );

    return this.musicLibraryService.createAlbum({
      name: spotifyAlbum.name,
      artists,
      spotify: {
        id: spotifyAlbum.id,
        uri: spotifyAlbum.uri,
        type: spotifyAlbum.type,
        href: spotifyAlbum.href,
      },
    });
  }

  @Span()
  async importArtist(
    spotifyID: string,
    retryOnExpiredToken: boolean = true
  ): Promise<Artist> {
    const artist = await this.musicLibraryService.findArtist({
      spotify: { id: spotifyID },
    });
    if (artist) {
      return artist;
    }

    let spotifyArtist: ArtistObject;

    try {
      spotifyArtist = await this.spotifyApi.getArtist(
        this.appAccessToken,
        spotifyID
      );
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        await this.refreshAppAccessToken();

        return this.importArtist(spotifyID, false);
      }

      throw err;
    }

    const genres = await Promise.all(
      spotifyArtist.genres.map((genreName) => this.importGenre(genreName))
    );

    return this.musicLibraryService.createArtist({
      name: spotifyArtist.name,
      genres,
      spotify: {
        id: spotifyArtist.id,
        uri: spotifyArtist.uri,
        type: spotifyArtist.type,
        href: spotifyArtist.href,
      },
    });
  }

  @Span()
  async updateArtist(
    spotifyID: string,
    retryOnExpiredToken: boolean = true
  ): Promise<Artist> {
    const artist = await this.importArtist(spotifyID, retryOnExpiredToken);

    let spotifyArtist: ArtistObject;

    try {
      spotifyArtist = await this.spotifyApi.getArtist(
        this.appAccessToken,
        spotifyID
      );
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        await this.refreshAppAccessToken();

        return this.updateArtist(spotifyID, false);
      }

      throw err;
    }

    const genres = await Promise.all(
      spotifyArtist.genres.map((genreName) => this.importGenre(genreName))
    );

    await this.musicLibraryService.updateArtist({
      artist,
      updatedFields: {
        name: spotifyArtist.name,
        genres,
      },
    });

    return artist;
  }

  @Span()
  async importGenre(name: string): Promise<Genre> {
    const genre = await this.musicLibraryService.findGenre({
      name,
    });
    if (genre) {
      return genre;
    }

    return this.musicLibraryService.createGenre({
      name,
    });
  }

  @Span()
  private async refreshAppAccessToken(): Promise<void> {
    if (!this.appAccessTokenInProgress) {
      this.logger.debug("refreshing spotify app access token");
      /* eslint-disable no-async-promise-executor */

      this.appAccessTokenInProgress = new Promise(async (resolve, reject) => {
        try {
          const newAccessToken =
            await this.spotifyAuth.clientCredentialsGrant();
          this.appAccessToken = newAccessToken;

          this.logger.debug("spotify app access token refreshed");

          resolve();
        } catch (err) {
          this.logger.warn(
            `Error while refreshing spotify app access token ${err}`
          );

          reject(err);
        } finally {
          this.appAccessTokenInProgress = null;
        }
      });
    }

    return this.appAccessTokenInProgress;
  }
}
