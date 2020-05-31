import { Artist } from "../../music-library/artist.entity";

export class TopArtistsReportDto {
  items: {
    artist: Artist;
    count: number;
  }[];
}
