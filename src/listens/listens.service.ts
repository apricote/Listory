import { Injectable } from "@nestjs/common";
import { Listen } from "./listen.entity";
import { ListenRepository } from "./listen.repository";
import { CreateListenDto } from "./dto/create-listen.dto";

@Injectable()
export class ListensService {
  constructor(private readonly listenRepository: ListenRepository) {}

  async createListen({
    user,
    track,
    playedAt
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
          where: { user, track, playedAt }
        });
      }

      throw err;
    }

    return listen;
  }
}
