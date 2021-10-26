import { ValidateNested } from "class-validator";
import { User } from "../../users/user.entity";
import { ReportTimeDto } from "./report-time.dto";

export class GetTopGenresReportDto {
  user: User;

  @ValidateNested()
  time: ReportTimeDto;
}
