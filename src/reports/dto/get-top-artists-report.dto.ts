import { IsEnum, IsISO8601, ValidateIf } from "class-validator";
import { User } from "../../users/user.entity";
import { TimePreset } from "../timePreset.enum";

export class GetTopArtistsReportDto {
  user: User;

  @IsEnum(TimePreset)
  timePreset: TimePreset;

  @ValidateIf((o) => o.timePreset === TimePreset.CUSTOM)
  @IsISO8601()
  customTimeStart: string;

  @ValidateIf((o) => o.timePreset === TimePreset.CUSTOM)
  @IsISO8601()
  customTimeEnd: string;
}
