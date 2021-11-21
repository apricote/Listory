import { Artist } from "../artist.entity";
import { Genre } from "../genre.entity";

export class UpdateArtistDto {
  artist: Artist;
  updatedFields: {
    name: string;
    genres: Genre[];
  };
}
