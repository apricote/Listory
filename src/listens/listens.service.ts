import { Injectable } from "@nestjs/common";
import {
  IPaginationOptions,
  paginate,
  Pagination,
  PaginationTypeEnum,
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

  async createListens(
    listensData: CreateListenRequestDto[]
  ): Promise<Listen[]> {
    const existingListens = await this.listenRepository.findBy(listensData);

    const missingListens = listensData.filter(
      (newListen) =>
        !existingListens.some(
          (existingListen) =>
            newListen.user.id === existingListen.user.id &&
            newListen.track.id === existingListen.track.id &&
            newListen.playedAt.getTime() === existingListen.playedAt.getTime()
        )
    );

    return this.listenRepository.save(
      missingListens.map((entry) => this.listenRepository.create(entry))
    );
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
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    });
  }

  async getMostRecentListenPerUser(): Promise<Listen[]> {
    return this.listenRepository
      .createQueryBuilder("listen")
      .leftJoinAndSelect("listen.user", "user")
      .distinctOn(["user.id"])
      .orderBy({ "user.id": "ASC", "listen.playedAt": "DESC" })
      .limit(1)
      .getMany();
  }

  getScopedQueryBuilder(): ListenScopes {
    return this.listenRepository.scoped;
  }
}
