import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrUpdateDto } from "./dto/create-or-update.dto";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { SpotifyConnection } from "src/sources/spotify/spotify-connection.entity";

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException("UserNotFound");
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createOrUpdate(data: CreateOrUpdateDto): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { spotify: { id: data.spotify.id } }
    });

    if (!user) {
      user = this.userRepository.create({
        spotify: {
          id: data.spotify.id
        }
      });
    }

    user.spotify.accessToken = data.spotify.accessToken;
    user.spotify.refreshToken = data.spotify.refreshToken;
    user.displayName = data.displayName;
    user.photo = data.photo;

    await this.userRepository.save(user);

    return user;
  }

  async updateSpotifyConnection(
    user: User,
    spotify: SpotifyConnection
  ): Promise<void> {
    user.spotify = spotify;
    await this.userRepository.save(user);
  }
}
