import { Injectable } from "@nestjs/common";
import { getTime, parseISO, getUnixTime } from "date-fns";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { CreateListenDto } from "./dto/create-listen.dto";
import { GetListensDto } from "./dto/get-listens.dto";
import { Listen } from "./listen.entity";
import { ListenRepository } from "./listen.repository";

@Injectable()
export class ListensService {
  constructor(private readonly listenRepository: ListenRepository) {}

  async createListen({
    user,
    track,
    playedAt,
  }: CreateListenDto): Promise<Listen> {
    const listen = this.listenRepository.create();

    listen.user = user;
    listen.track = track;
    listen.playedAt = playedAt;

    try {
      await this.listenRepository.save(listen);
    } catch (err) {
      if (err.code === "23505") {
        return this.listenRepository.findOne({
          where: { user, track, playedAt },
        });
      }

      throw err;
    }

    return listen;
  }

  async getListens(
    options: GetListensDto & IPaginationOptions
  ): Promise<Pagination<Listen>> {
    const { page, limit, user, filter } = options;

    let queryBuilder = this.listenRepository
      .createQueryBuilder("l")
      .leftJoin("l.user", "user")
      .where("user.id = :userID", { userID: user.id })
      .leftJoinAndSelect("l.track", "track")
      .leftJoinAndSelect("track.artists", "artists")
      .leftJoinAndSelect("track.album", "album")
      .leftJoinAndSelect("album.artists", "albumArtists")
      .orderBy("l.playedAt", "DESC");

    if (filter) {
      if (filter.time) {
        queryBuilder = queryBuilder.andWhere(
          "l.playedAt BETWEEN :timeStart AND :timeEnd",
          {
            timeStart: parseISO(filter.time.start),
            timeEnd: parseISO(filter.time.end),
          }
        );
      }
    }

    return paginate<Listen>(queryBuilder, {
      page,
      limit,
    });
  }
}
