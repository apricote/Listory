import { Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async spotifyLogin({
    accessToken,
    refreshToken,
    profile
  }: LoginDto): Promise<User> {
    const user = await this.usersService.createOrUpdate({
      displayName: profile.displayName,
      photo: profile.photos.length > 0 ? profile.photos[0] : null,
      spotify: {
        id: profile.id,
        accessToken,
        refreshToken
      }
    });

    return user;
  }

  async createToken(user: User): Promise<{ accessToken }> {
    const payload = {
      sub: user.id,
      name: user.displayName,
      picture: user.photo
    };

    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }

  async findUser(id: string): Promise<User> {
    return this.usersService.findById(id);
  }
}
