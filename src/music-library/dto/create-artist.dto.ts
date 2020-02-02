import { SpotifyLibraryDetails } from "../../sources/spotify/spotify-library-details.entity";

export class CreateArtistDto {
  name: string;
  spotify?: SpotifyLibraryDetails;
}
