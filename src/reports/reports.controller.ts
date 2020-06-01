import { Controller, Get, Query } from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ReqUser } from "../auth/decorators/req-user.decorator";
import { User } from "../users/user.entity";
import { GetListenReportDto } from "./dto/get-listen-report.dto";
import { ListenReportDto } from "./dto/listen-report.dto";
import { ReportsService } from "./reports.service";

@Controller("api/v1/reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("listens")
  @Auth()
  async getListens(
    @Query() options: GetListenReportDto,
    @ReqUser() user: User
  ): Promise<ListenReportDto> {
    return this.reportsService.getListens({ ...options, user });
  }
}
