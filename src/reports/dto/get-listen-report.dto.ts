import { IsEnum, IsISO8601 } from "class-validator";
import { User } from "../../users/user.entity";
import { Timeframe } from "../timeframe.enum";

export class GetListenReportDto {
  user: User;

  @IsEnum(Timeframe)
  timeFrame: Timeframe;

  @IsISO8601()
  timeStart: string;

  @IsISO8601()
  timeEnd: string;
}
