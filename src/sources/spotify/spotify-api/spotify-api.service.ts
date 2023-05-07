import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { SpotifyConnection } from "../spotify-connection.entity";
import { AlbumObject } from "./entities/album-object";
import { ArtistObject } from "./entities/artist-object";
import { PagingObject } from "./entities/paging-object";
import { PlayHistoryObject } from "./entities/play-history-object";
import { TrackObject } from "./entities/track-object";

@Injectable()
export class SpotifyApiService {
  constructor(private readonly httpService: HttpService) {}

  async getRecentlyPlayedTracks({
    accessToken,
  }: SpotifyConnection): Promise<PlayHistoryObject[]> {
    const parameters: { limit: number; after?: number } = {
      limit: 50,
    };

    const history = await firstValueFrom(
      this.httpService.get<PagingObject<PlayHistoryObject>>(
        `v1/me/player/recently-played`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: parameters,
        }
      )
    );

    return history.data.items;
  }

  async getArtist(
    accessToken: string,
    spotifyID: string
  ): Promise<ArtistObject> {
    const artist = await firstValueFrom(
      this.httpService.get<ArtistObject>(`v1/artists/${spotifyID}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    );

    return artist.data;
  }

  async getArtists(
    accessToken: string,
    spotifyIDs: string[]
  ): Promise<ArtistObject[]> {
    const artist = await firstValueFrom(
      this.httpService.get<{ artists: ArtistObject[] }>(`v1/artists`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          ids: spotifyIDs.join(","),
        },
      })
    );

    return artist.data.artists;
  }

  async getAlbum(accessToken: string, spotifyID: string): Promise<AlbumObject> {
    const album = await firstValueFrom(
      this.httpService.get<AlbumObject>(`v1/albums/${spotifyID}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    );
    return album.data;
  }

  async getAlbums(
    accessToken: string,
    spotifyIDs: string[]
  ): Promise<AlbumObject[]> {
    const album = await firstValueFrom(
      this.httpService.get<{ albums: AlbumObject[] }>(`v1/albums`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          ids: spotifyIDs.join(","),
        },
      })
    );
    return album.data.albums;
  }

  async getTrack(accessToken: string, spotifyID: string): Promise<TrackObject> {
    const track = await firstValueFrom(
      this.httpService.get<TrackObject>(`v1/tracks/${spotifyID}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    );

    return track.data;
  }

  async getTracks(
    accessToken: string,
    spotifyIDs: string[]
  ): Promise<TrackObject[]> {
    const track = await firstValueFrom(
      this.httpService.get<{ tracks: TrackObject[] }>(`v1/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          ids: spotifyIDs.join(","),
        },
      })
    );

    return track.data.tracks;
  }
}
