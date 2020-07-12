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
}
