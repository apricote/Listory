import { Injectable } from "@nestjs/common";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { CreateListenDto } from "./dto/create-listen.dto";
import { Listen } from "./listen.entity";
import { ListenRepository } from "./listen.repository";
import { GetListensDto } from "./dto/get-listens.dto";

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
    const { page, limit, user } = options;

    const queryBuilder = this.listenRepository
      .createQueryBuilder("l")
      .leftJoin("l.user", "user")
      .where("user.id = :userID", { userID: user.id })
      .leftJoinAndSelect("l.track", "track")
      .leftJoinAndSelect("track.artists", "artists")
      .leftJoinAndSelect("track.album", "album")
      .leftJoinAndSelect("album.artists", "albumArtists")
      .orderBy("l.playedAt", "DESC");

    return paginate<Listen>(queryBuilder, {
      page,
      limit,
    });
  }
}
