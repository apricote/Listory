import { SpotifyLibraryDetails } from "../../sources/spotify/spotify-library-details.entity";
import { Genre } from "../genre.entity";

export class CreateArtistDto {
  name: string;
  genres: Genre[];
  spotify?: SpotifyLibraryDetails;
}
