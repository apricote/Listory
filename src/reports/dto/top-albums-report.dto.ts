import { Album } from "../../music-library/album.entity";

export class TopAlbumsReportDto {
  items: {
    album: Album;
    count: number;
  }[];
}
