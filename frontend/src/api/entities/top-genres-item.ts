import { Genre } from "./genre";
import { TopArtistsItem } from "./top-artists-item";

export interface TopGenresItem {
  genre: Genre;
  artists: TopArtistsItem[];
  count: number;
}
