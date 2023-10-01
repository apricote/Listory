import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize } from "class-validator";
import { SpotifyExtendedStreamingHistoryItemDto } from "./spotify-extended-streaming-history-item.dto";

export class ImportExtendedStreamingHistoryDto {
  @ApiProperty({
    type: SpotifyExtendedStreamingHistoryItemDto,
    isArray: true,
    maxItems: 50_000,
  })
  @ArrayMaxSize(50_000) // File size is ~16k by default, might need refactoring if Spotify starts exporting larger files
  listens: SpotifyExtendedStreamingHistoryItemDto[];
}
