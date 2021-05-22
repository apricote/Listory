import { ValidateNested } from "class-validator";
import { User } from "../../users/user.entity";
import { ReportTimeDto } from "./report-time.dto";

export class GetTopTracksReportDto {
  user: User;

  @ValidateNested()
  time: ReportTimeDto;
}
