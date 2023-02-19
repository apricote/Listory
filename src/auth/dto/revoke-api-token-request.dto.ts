import { ApiProperty } from "@nestjs/swagger";

export class RevokeApiTokenRequestDto {
  @ApiProperty({
    description: "The API Token that should be revoked",
    example: "lisasdasdjaksr2381asd",
  })
  token: string;
}
