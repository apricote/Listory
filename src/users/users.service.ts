import { JobService } from "@apricote/nest-pg-boss";
import { Injectable, NotFoundException } from "@nestjs/common";
import { IImportSpotifyJob, ImportSpotifyJob } from "../sources/jobs";
import { SpotifyConnection } from "../sources/spotify/spotify-connection.entity";
import { CreateOrUpdateDto } from "./dto/create-or-update.dto";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @ImportSpotifyJob.Inject()
    private readonly importSpotifyJobService: JobService<IImportSpotifyJob>
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException("UserNotFound");
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createOrUpdate(data: CreateOrUpdateDto): Promise<User> {
    let user = await this.userRepository.findOneBy({
      spotify: { id: data.spotify.id },
    });

    const isNew = !user;
    if (isNew) {
      user = this.userRepository.create({
        spotify: {
          id: data.spotify.id,
        },
      });
    }

    user.spotify.accessToken = data.spotify.accessToken;
    user.spotify.refreshToken = data.spotify.refreshToken;
    user.displayName = data.displayName;
    user.photo = data.photo;

    await this.userRepository.save(user);

    if (isNew) {
      // Make sure that existing listens are crawled immediately
      this.importSpotifyJobService.sendOnce({ userID: user.id }, {}, user.id);
    }

    return user;
  }

  async updateSpotifyConnection(
    user: User,
    spotify: SpotifyConnection
  ): Promise<void> {
    // eslint-disable-next-line no-param-reassign
    user.spotify = spotify;
    await this.userRepository.save(user);
  }
}
