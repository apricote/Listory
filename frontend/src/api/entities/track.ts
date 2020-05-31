import { Album } from "./album";
import { Artist } from "./artist";
import { SpotifyInfo } from "./spotify-info";

export interface Track {
  id: string;
  name: string;
  album: Album;
  artists: Artist[];
  spotify?: SpotifyInfo;
}
