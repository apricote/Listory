import { Controller, Get, Query } from "@nestjs/common";
import { Pagination } from "nestjs-typeorm-paginate";
import { AuthAccessToken } from "../auth/decorators/auth-access-token.decorator";
import { ReqUser } from "../auth/decorators/req-user.decorator";
import { User } from "../users/user.entity";
import { GetListensFilterDto } from "./dto/get-listens.dto";
import { Listen } from "./listen.entity";
import { ListensService } from "./listens.service";

@Controller("api/v1/listens")
export class ListensController {
  constructor(private readonly listensService: ListensService) {}

  @Get()
  @AuthAccessToken()
  async getRecentlyPlayed(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("filter") filter: GetListensFilterDto,
    @ReqUser() user: User
  ): Promise<Pagination<Listen>> {
    limit = limit > 100 ? 100 : limit;

    return this.listensService.getListens({ page, limit, user, filter });
  }
}
