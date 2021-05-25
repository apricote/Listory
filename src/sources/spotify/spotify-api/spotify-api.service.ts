import { HttpService, Injectable } from "@nestjs/common";
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

    const history = await this.httpService
      .get<PagingObject<PlayHistoryObject>>(`v1/me/player/recently-played`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: parameters,
      })
      .toPromise();

    return history.data.items;
  }

  async getArtist(
    accessToken: string,
    spotifyID: string
  ): Promise<ArtistObject> {
    const artist = await this.httpService
      .get<ArtistObject>(`v1/artists/${spotifyID}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    return artist.data;
  }

  async getAlbum(accessToken: string, spotifyID: string): Promise<AlbumObject> {
    const album = await this.httpService
      .get<AlbumObject>(`v1/albums/${spotifyID}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    return album.data;
  }

  async getTrack(accessToken: string, spotifyID: string): Promise<TrackObject> {
    const track = await this.httpService
      .get<TrackObject>(`v1/tracks/${spotifyID}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    return track.data;
  }
}
