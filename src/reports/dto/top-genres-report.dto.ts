import { Genre } from "../../music-library/genre.entity";
import { TopArtistsReportDto } from "./top-artists-report.dto";

export class TopGenresReportDto {
  items: {
    genre: Genre;
    artists: TopArtistsReportDto["items"];
    count: number;
  }[];
}
