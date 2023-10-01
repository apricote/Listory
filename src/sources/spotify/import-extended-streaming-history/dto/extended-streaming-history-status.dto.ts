import { ApiProperty } from "@nestjs/swagger";

export class ExtendedStreamingHistoryStatusDto {
  @ApiProperty({
    type: Number,
  })
  total: number;

  @ApiProperty({
    type: Number,
  })
  imported: number;
}
