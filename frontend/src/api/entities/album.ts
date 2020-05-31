import { SpotifyInfo } from "./spotify-info";

export interface Album {
  id: string;
  name: string;
  spotify?: SpotifyInfo;
}
