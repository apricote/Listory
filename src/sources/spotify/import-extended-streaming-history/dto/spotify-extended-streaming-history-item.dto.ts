import { ApiProperty } from "@nestjs/swagger";

export class SpotifyExtendedStreamingHistoryItemDto {
  @ApiProperty({ format: "iso8601", example: "2018-11-30T08:33:33Z" })
  ts: string;

  @ApiProperty({ example: "spotify:track:6askbS4pEVWbbDnUGEXh3G" })
  spotify_track_uri: string;
}
