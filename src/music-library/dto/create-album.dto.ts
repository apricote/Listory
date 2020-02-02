import { SpotifyLibraryDetails } from "../../sources/spotify/spotify-library-details.entity";
import { Artist } from "../artist.entity";

export class CreateAlbumDto {
  name: string;
  artists: Artist[];
  spotify?: SpotifyLibraryDetails;
}
