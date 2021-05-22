import { Track } from "../../music-library/track.entity";

export class TopTracksReportDto {
  items: {
    track: Track;
    count: number;
  }[];
}
