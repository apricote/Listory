import { IsEnum, IsISO8601, ValidateIf } from "class-validator";
import { TimePreset } from "../timePreset.enum";

export class ReportTimeDto {
  @IsEnum(TimePreset)
  timePreset: TimePreset;

  @ValidateIf((o) => o.timePreset === TimePreset.CUSTOM)
  @IsISO8601()
  customTimeStart: string;

  @ValidateIf((o) => o.timePreset === TimePreset.CUSTOM)
  @IsISO8601()
  customTimeEnd: string;
}
