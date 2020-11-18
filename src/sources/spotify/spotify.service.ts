import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { ListensService } from "../../listens/listens.service";
import { Album } from "../../music-library/album.entity";
import { Artist } from "../../music-library/artist.entity";
import { MusicLibraryService } from "../../music-library/music-library.service";
import { Track } from "../../music-library/track.entity";
import { User } from "../../users/user.entity";
import { UsersService } from "../../users/users.service";
import { AlbumObject } from "./spotify-api/entities/album-object";
import { ArtistObject } from "./spotify-api/entities/artist-object";
import { PlayHistoryObject } from "./spotify-api/entities/play-history-object";
import { TrackObject } from "./spotify-api/entities/track-object";
import { SpotifyApiService } from "./spotify-api/spotify-api.service";
import { SpotifyAuthService } from "./spotify-auth/spotify-auth.service";

@Injectable()
export class SpotifyService {
  private appAccessToken: string | null;
  private appAccessTokenInProgress: Promise<void> | null;

  constructor(
    private readonly usersService: UsersService,
    private readonly listensService: ListensService,
    private readonly musicLibraryService: MusicLibraryService,
    private readonly spotifyApi: SpotifyApiService,
    private readonly spotifyAuth: SpotifyAuthService
  ) {}

  @Interval(20 * 1000)
  async getRecentlyPlayedTracks(): Promise<void> {
    const users = await this.usersService.findAll();

    for (const user of users) {
      await this.processUser(user);
    }
  }

  async processUser(
    user: User,
    retryOnExpiredToken: boolean = true
  ): Promise<void> {
    let playHistory: PlayHistoryObject[];
    try {
      playHistory = await this.spotifyApi.getRecentlyPlayedTracks(user.spotify);
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        const accessToken = await this.spotifyAuth.refreshAccessToken(
          user.spotify
        );
        await this.usersService.updateSpotifyConnection(user, {
          ...user.spotify,
          accessToken,
        });
        await this.processUser(user, false);
      } else {
        // TODO sent to sentry
        console.error(
          "Unexpected error while fetching recently played tracks",
          err
        );
      }

      // Makes no sense to keep processing the (inexistant) data but if we throw
      // the error the fetch loop will not process other users.
      return;
    }

    if (playHistory.length === 0) {
      return;
    }

    await Promise.all(
      playHistory.map(async (history) => {
        const track = await this.importTrack(history.track.id);

        this.listensService.createListen({
          user,
          track,
          playedAt: new Date(history.played_at),
        });

        console.log(
          `Found Listen!: ${user.displayName} listened to "${track.name}" by "${track.artists}"`
        );
      })
    );

    const newestPlayTime = new Date(
      playHistory
        .map((history) => history.played_at)
        .sort()
        .pop()
    );

    console.log("newestPlayTime", {
      newestPlayTime,
      times: playHistory.map((history) => history.played_at).sort(),
    });

    this.usersService.updateSpotifyConnection(user, {
      ...user.spotify,
      lastRefreshTime: newestPlayTime,
    });
  }

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
      if (err.response && err.response.status === 401) {
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
      if (err.response && err.response.status === 401) {
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
      if (err.response && err.response.status === 401) {
        await this.refreshAppAccessToken();

        return this.importArtist(spotifyID, false);
      }

      throw err;
    }

    return this.musicLibraryService.createArtist({
      name: spotifyArtist.name,
      spotify: {
        id: spotifyArtist.id,
        uri: spotifyArtist.uri,
        type: spotifyArtist.type,
        href: spotifyArtist.href,
      },
    });
  }

  private async refreshAppAccessToken(): Promise<void> {
    if (!this.appAccessTokenInProgress) {
      console.log("refreshAppAccessToken");
      this.appAccessTokenInProgress = new Promise(async (resolve, reject) => {
        try {
          const newAccessToken = await this.spotifyAuth.clientCredentialsGrant();
          this.appAccessToken = newAccessToken;
          resolve();
        } catch (err) {
          reject(err);
        } finally {
          this.appAccessTokenInProgress = null;
        }
      });
    } else {
      console.log(
        "refreshAppAccessToken already in progress, awaiting its result"
      );
    }

    return this.appAccessTokenInProgress;
  }
}
