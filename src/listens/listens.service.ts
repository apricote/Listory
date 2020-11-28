import { Injectable } from "@nestjs/common";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import {
  CreateListenRequestDto,
  CreateListenResponseDto,
} from "./dto/create-listen.dto";
import { GetListensDto } from "./dto/get-listens.dto";
import { Listen } from "./listen.entity";
import { ListenRepository, ListenScopes } from "./listen.repository";

@Injectable()
export class ListensService {
  constructor(private readonly listenRepository: ListenRepository) {}

  async createListen({
    user,
    track,
    playedAt,
  }: CreateListenRequestDto): Promise<CreateListenResponseDto> {
    const response = await this.listenRepository.insertNoConflict({
      user,
      track,
      playedAt,
    });

    return response;
  }

  async getListens(
    options: GetListensDto & IPaginationOptions
  ): Promise<Pagination<Listen>> {
    const { page, limit, user, filter } = options;

    let queryBuilder = this.listenRepository.scoped
      .byUser(user)
      .leftJoinAndSelect("listen.track", "track")
      .leftJoinAndSelect("track.artists", "artists")
      .leftJoinAndSelect("track.album", "album")
      .leftJoinAndSelect("album.artists", "albumArtists")
      .orderBy("listen.playedAt", "DESC");

    if (filter) {
      if (filter.time) {
        queryBuilder = queryBuilder.duringInterval(filter.time);
      }
    }

    return paginate<Listen>(queryBuilder, {
      page,
      limit,
    });
  }

  getScopedQueryBuilder(): ListenScopes {
    return this.listenRepository.scoped;
  }
}
