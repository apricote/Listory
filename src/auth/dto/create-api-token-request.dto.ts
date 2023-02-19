import { ApiProperty } from "@nestjs/swagger";

export class CreateApiTokenRequestDto {
  @ApiProperty({
    description: "Opaque text field to identify the API token",
    example: "My super duper token",
  })
  description: string;
}
