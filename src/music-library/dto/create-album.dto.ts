import { SpotifyLibraryDetails } from "../../sources/spotify/spotify-library-details.entity";
import { Artist } from "../artist.entity";
import { Genre } from "../genre.entity";

export class CreateAlbumDto {
  name: string;
  artists: Artist[];
  genres: Genre[];
  spotify?: SpotifyLibraryDetails;
}
