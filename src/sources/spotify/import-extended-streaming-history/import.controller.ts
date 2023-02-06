import { Body as NestBody, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthAccessToken } from "../../../auth/decorators/auth-access-token.decorator";
import { ReqUser } from "../../../auth/decorators/req-user.decorator";
import { User } from "../../../users/user.entity";
import { ExtendedStreamingHistoryStatusDto } from "./dto/extended-streaming-history-status.dto";
import { ImportExtendedStreamingHistoryDto } from "./dto/import-extended-streaming-history.dto";
import { ImportService } from "./import.service";

@ApiTags("import")
@Controller("api/v1/import")
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post("extended-streaming-history")
  @ApiBody({ type: () => ImportExtendedStreamingHistoryDto })
  @AuthAccessToken()
  async importExtendedStreamingHistory(
    @ReqUser() user: User,
    @NestBody() data: ImportExtendedStreamingHistoryDto,
  ): Promise<void> {
    return this.importService.importExtendedStreamingHistory(user, data);
  }

  @Get("extended-streaming-history/status")
  @AuthAccessToken()
  async getExtendedStreamingHistoryStatus(
    @ReqUser() user: User,
  ): Promise<ExtendedStreamingHistoryStatusDto> {
    return this.importService.getExtendedStreamingHistoryStatus(user);
  }
}
