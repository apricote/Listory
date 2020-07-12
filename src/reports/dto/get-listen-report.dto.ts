import { IsEnum, ValidateNested } from "class-validator";
import { User } from "../../users/user.entity";
import { Timeframe } from "../timeframe.enum";
import { ReportTimeDto } from "./report-time.dto";

export class GetListenReportDto {
  user: User;

  @IsEnum(Timeframe)
  timeFrame: Timeframe;

  @ValidateNested()
  time: ReportTimeDto;
}
