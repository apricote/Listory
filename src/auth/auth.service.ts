import { Injectable, ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  private readonly userFilter: null | string;
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {
    this.userFilter = this.config.get<string>("SPOTIFY_USER_FILTER");
  }

  async spotifyLogin({
    accessToken,
    refreshToken,
    profile,
  }: LoginDto): Promise<User> {
    if (!this.allowedByUserFilter(profile.id)) {
      throw new ForbiddenException("UserNotWhitelisted");
    }

    const user = await this.usersService.createOrUpdate({
      displayName: profile.displayName,
      photo: profile.photos.length > 0 ? profile.photos[0] : null,
      spotify: {
        id: profile.id,
        accessToken,
        refreshToken,
      },
    });

    return user;
  }

  async createToken(user: User): Promise<{ accessToken }> {
    const payload = {
      sub: user.id,
      name: user.displayName,
      picture: user.photo,
    };

    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }

  async findUser(id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  allowedByUserFilter(spotifyID: string) {
    if (!this.userFilter) {
      return true;
    }

    const whitelistedIDs = this.userFilter.split(",");

    console.log("whitelisted ids", {
      whitelistedIDs,
      uf: this.userFilter,
      spotifyID,
    });

    return whitelistedIDs.includes(spotifyID);
  }
}
