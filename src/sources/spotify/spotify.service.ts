import { Injectable, Logger } from "@nestjs/common";
import { chunk, uniq } from "lodash";
import { Span } from "nestjs-otel";
import type { Job } from "pg-boss";
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

/** Number of IDs that can be passed to Spotify Web API "Get Several Artist/Track" calls. */
const SPOTIFY_BULK_MAX_IDS = 50;
/** Number of IDs that can be passed to Spotify Web API "Get Several Album" calls. */
const SPOTIFY_BULK_ALBUMS_MAX_IDS = 20;

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
    private readonly spotifyAuth: SpotifyAuthService,
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
  async importSpotifyJobHandler({
    data: { userID },
  }: Job<IImportSpotifyJob>): Promise<void> {
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
    retryOnExpiredToken: boolean = true,
  ): Promise<void> {
    this.logger.debug({ userId: user.id }, `Crawling recently played tracks`);

    let playHistory: PlayHistoryObject[];
    try {
      playHistory = await this.spotifyApi.getRecentlyPlayedTracks(user.spotify);
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        try {
          const accessToken = await this.spotifyAuth.refreshAccessToken(
            user.spotify,
          );
          await this.usersService.updateSpotifyConnection(user, {
            ...user.spotify,
            accessToken,
          });
          await this.crawlListensForUser(user, false);
        } catch (errFromAuth) {
          this.logger.error(
            { userId: user.id },
            `Refreshing access token failed for user "${user.id}": ${errFromAuth}`,
          );
          throw errFromAuth;
        }

        return;
      }

      this.logger.error(
        `Unexpected error while fetching recently played tracks: ${err}`,
      );
      throw err;
    }

    if (playHistory.length === 0) {
      return;
    }

    const tracks = await this.importTracks(
      uniq(playHistory.map((history) => history.track.id)),
    );

    const listenData = playHistory.map((history) => ({
      user,
      track: tracks.find((track) => history.track.id === track.spotify.id),
      playedAt: new Date(history.played_at),
    }));

    const results = await this.listensService.createListens(listenData);

    results.forEach((listen) =>
      this.logger.debug(
        { userId: user.id },
        `New listen found! ${user.id} listened to "${
          listen.track.name
        }" by ${listen.track.artists
          ?.map((artist) => `"${artist.name}"`)
          .join(", ")}`,
      ),
    );

    const newestPlayTime = new Date(
      playHistory
        .map((history) => history.played_at)
        .sort()
        .pop(),
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
    retryOnExpiredToken: boolean = true,
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
        spotifyID,
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
          this.importArtist(artistID),
        ),
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
  async importTracks(
    spotifyIDs: string[],
    retryOnExpiredToken: boolean = true,
  ): Promise<Track[]> {
    const tracks = await this.musicLibraryService.findTracks(
      spotifyIDs.map((id) => ({ spotify: { id } })),
    );

    // Get missing ids
    const missingIDs = spotifyIDs.filter(
      (id) => !tracks.some((track) => track.spotify.id === id),
    );

    // No need to make spotify api request if all data is available locally
    if (missingIDs.length === 0) {
      return tracks;
    }

    let spotifyTracks: TrackObject[] = [];

    // Split the import requests so we stay within the spotify api limits
    try {
      await Promise.all(
        chunk(missingIDs, SPOTIFY_BULK_MAX_IDS).map(async (ids) => {
          const batchTracks = await this.spotifyApi.getTracks(
            this.appAccessToken,
            ids,
          );

          spotifyTracks.push(...batchTracks);
        }),
      );
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        await this.refreshAppAccessToken();

        return this.importTracks(spotifyIDs, false);
      }

      throw err;
    }

    // We import albums & artist in series because the album import also
    // triggers an artist import. In the best case, all artists will already be
    // imported by the importArtists() call, and the album call can get them
    // from the database.
    const artists = await this.importArtists(
      uniq(
        spotifyTracks.flatMap((track) =>
          track.artists.map((artist) => artist.id),
        ),
      ),
    );

    const albums = await this.importAlbums(
      uniq(spotifyTracks.map((track) => track.album.id)),
    );

    // Find the right albums & artists for each spotify track & create db entry
    const newTracks = await this.musicLibraryService.createTracks(
      spotifyTracks.map((spotifyTrack) => {
        const trackAlbum = albums.find(
          (album) => spotifyTrack.album.id === album.spotify.id,
        );

        const trackArtists = spotifyTrack.artists.map((trackArtist) =>
          artists.find((artist) => trackArtist.id == artist.spotify.id),
        );

        return {
          name: spotifyTrack.name,
          album: trackAlbum,
          artists: trackArtists,
          spotify: {
            id: spotifyTrack.id,
            uri: spotifyTrack.uri,
            type: spotifyTrack.type,
            href: spotifyTrack.href,
          },
        };
      }),
    );

    // Return new & existing tracks
    return [...tracks, ...newTracks];
  }

  @Span()
  async importAlbum(
    spotifyID: string,
    retryOnExpiredToken: boolean = true,
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
        spotifyID,
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
        this.importArtist(artistID),
      ),
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
  async importAlbums(
    spotifyIDs: string[],
    retryOnExpiredToken: boolean = true,
  ): Promise<Album[]> {
    const albums = await this.musicLibraryService.findAlbums(
      spotifyIDs.map((id) => ({ spotify: { id } })),
    );

    // Get missing ids
    const missingIDs = spotifyIDs.filter(
      (id) => !albums.some((album) => album.spotify.id === id),
    );

    // No need to make spotify api request if all data is available locally
    if (missingIDs.length === 0) {
      return albums;
    }

    let spotifyAlbums: AlbumObject[] = [];

    // Split the import requests so we stay within the spotify api limits
    try {
      await Promise.all(
        chunk(missingIDs, SPOTIFY_BULK_ALBUMS_MAX_IDS).map(async (ids) => {
          const batchAlbums = await this.spotifyApi.getAlbums(
            this.appAccessToken,
            ids,
          );

          spotifyAlbums.push(...batchAlbums);
        }),
      );
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        await this.refreshAppAccessToken();

        return this.importAlbums(spotifyIDs, false);
      }

      throw err;
    }

    const artists = await this.importArtists(
      uniq(
        spotifyAlbums.flatMap((album) =>
          album.artists.map((artist) => artist.id),
        ),
      ),
    );

    // Find the right albums & artists for each spotify track & create db entry
    const newAlbums = await this.musicLibraryService.createAlbums(
      spotifyAlbums.map((spotifyAlbum) => {
        const albumArtists = spotifyAlbum.artists.map((albumArtist) =>
          artists.find((artist) => albumArtist.id == artist.spotify.id),
        );

        return {
          name: spotifyAlbum.name,
          artists: albumArtists,
          spotify: {
            id: spotifyAlbum.id,
            uri: spotifyAlbum.uri,
            type: spotifyAlbum.type,
            href: spotifyAlbum.href,
          },
        };
      }),
    );

    return [...albums, ...newAlbums];
  }

  @Span()
  async importArtist(
    spotifyID: string,
    retryOnExpiredToken: boolean = true,
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
        spotifyID,
      );
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        await this.refreshAppAccessToken();

        return this.importArtist(spotifyID, false);
      }

      throw err;
    }

    const genres = await Promise.all(
      spotifyArtist.genres.map((genreName) => this.importGenre(genreName)),
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
  async importArtists(
    spotifyIDs: string[],
    retryOnExpiredToken: boolean = true,
  ): Promise<Artist[]> {
    const artists = await this.musicLibraryService.findArtists(
      spotifyIDs.map((id) => ({ spotify: { id } })),
    );

    // Get missing ids
    const missingIDs = spotifyIDs.filter(
      (id) => !artists.some((artist) => artist.spotify.id === id),
    );

    // No need to make spotify api request if all data is available locally
    if (missingIDs.length === 0) {
      return artists;
    }

    let spotifyArtists: ArtistObject[] = [];

    // Split the import requests so we stay within the spotify api limits
    try {
      await Promise.all(
        chunk(missingIDs, SPOTIFY_BULK_MAX_IDS).map(async (ids) => {
          const batchArtists = await this.spotifyApi.getArtists(
            this.appAccessToken,
            ids,
          );

          spotifyArtists.push(...batchArtists);
        }),
      );
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        await this.refreshAppAccessToken();

        return this.importArtists(spotifyIDs, false);
      }

      throw err;
    }

    const genres = await this.importGenres(
      uniq(spotifyArtists.flatMap((artist) => artist.genres)),
    );

    // Find the right genres for each spotify artist & create db entry
    const newArtists = await this.musicLibraryService.createArtists(
      spotifyArtists.map((spotifyArtist) => {
        const artistGenres = spotifyArtist.genres.map((artistGenre) =>
          genres.find((genre) => artistGenre == genre.name),
        );

        return {
          name: spotifyArtist.name,
          genres: artistGenres,
          spotify: {
            id: spotifyArtist.id,
            uri: spotifyArtist.uri,
            type: spotifyArtist.type,
            href: spotifyArtist.href,
          },
        };
      }),
    );

    return [...artists, ...newArtists];
  }

  @Span()
  async updateArtist(
    spotifyID: string,
    retryOnExpiredToken: boolean = true,
  ): Promise<Artist> {
    const artist = await this.importArtist(spotifyID, retryOnExpiredToken);

    let spotifyArtist: ArtistObject;

    try {
      spotifyArtist = await this.spotifyApi.getArtist(
        this.appAccessToken,
        spotifyID,
      );
    } catch (err) {
      if (err.response && err.response.status === 401 && retryOnExpiredToken) {
        await this.refreshAppAccessToken();

        return this.updateArtist(spotifyID, false);
      }

      throw err;
    }

    const genres = await Promise.all(
      spotifyArtist.genres.map((genreName) => this.importGenre(genreName)),
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
  async importGenres(names: string[]): Promise<Genre[]> {
    const genres = await this.musicLibraryService.findGenres(
      names.map((name) => ({ name })),
    );

    // Get missing genres
    const missingGenres = names.filter(
      (name) => !genres.some((genre) => genre.name === name),
    );

    // No need to create genres if all data is available locally
    if (missingGenres.length === 0) {
      return genres;
    }

    const newGenres = await this.musicLibraryService.createGenres(
      missingGenres.map((name) => ({ name })),
    );

    return [...genres, ...newGenres];
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
            `Error while refreshing spotify app access token ${err}`,
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
