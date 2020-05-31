import { SpotifyInfo } from "./spotify-info";

export interface Artist {
  id: string;
  name: string;
  spotify?: SpotifyInfo;
}
