import { SpotifyLibraryDetails } from "../../sources/spotify/spotify-library-details.entity";
import { Album } from "../album.entity";
import { Artist } from "../artist.entity";

export class CreateTrackDto {
  album: Album;
  artists: Artist[];
  name: string;
  spotify?: SpotifyLibraryDetails;
}
