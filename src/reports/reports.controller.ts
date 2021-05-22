import { Controller, Get, Query } from "@nestjs/common";
import { AuthAccessToken } from "../auth/decorators/auth-access-token.decorator";
import { ReqUser } from "../auth/decorators/req-user.decorator";
import { User } from "../users/user.entity";
import { ListenReportDto } from "./dto/listen-report.dto";
import { ReportTimeDto } from "./dto/report-time.dto";
import { TopAlbumsReportDto } from "./dto/top-albums-report.dto";
import { TopArtistsReportDto } from "./dto/top-artists-report.dto";
import { TopTracksReportDto } from "./dto/top-tracks-report.dto";
import { ReportsService } from "./reports.service";
import { Timeframe } from "./timeframe.enum";

@Controller("api/v1/reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("listens")
  @AuthAccessToken()
  async getListens(
    @Query() time: ReportTimeDto,
    @Query("timeFrame") timeFrame: Timeframe,
    @ReqUser() user: User
  ): Promise<ListenReportDto> {
    return this.reportsService.getListens({ user, timeFrame, time });
  }

  @Get("top-artists")
  @AuthAccessToken()
  async getTopArtists(
    @Query() time: ReportTimeDto,
    @ReqUser() user: User
  ): Promise<TopArtistsReportDto> {
    return this.reportsService.getTopArtists({ user, time });
  }

  @Get("top-albums")
  @AuthAccessToken()
  async getTopAlbums(
    @Query() time: ReportTimeDto,
    @ReqUser() user: User
  ): Promise<TopAlbumsReportDto> {
    return this.reportsService.getTopAlbums({ user, time });
  }

  @Get("top-tracks")
  @AuthAccessToken()
  async getTopTracks(
    @Query() time: ReportTimeDto,
    @ReqUser() user: User
  ): Promise<TopTracksReportDto> {
    return this.reportsService.getTopTracks({ user, time });
  }
}
