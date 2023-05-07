import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { ApiToken } from "./api-token.entity";
import { ApiTokenRepository } from "./api-token.repository";
import { AuthSession } from "./auth-session.entity";
import { AuthSessionRepository } from "./auth-session.repository";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  private readonly userFilter: null | string;
  private readonly sessionExpirationTime: string;

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authSessionRepository: AuthSessionRepository,
    private readonly apiTokenRepository: ApiTokenRepository
  ) {
    this.userFilter = this.config.get<string>("SPOTIFY_USER_FILTER");
    this.sessionExpirationTime = this.config.get<string>(
      "SESSION_EXPIRATION_TIME"
    );
  }

  async spotifyLogin({
    accessToken,
    refreshToken,
    profile,
  }: LoginDto): Promise<User> {
    if (!this.allowedByUserFilter(profile.id)) {
      throw new ForbiddenException("UserNotInUserFilter");
    }

    const user = await this.usersService.createOrUpdate({
      displayName: profile.displayName,
      photo: profile.photos.length > 0 ? profile.photos[0].value : null,
      spotify: {
        id: profile.id,
        accessToken,
        refreshToken,
      },
    });

    return user;
  }

  async createSession(user: User): Promise<{
    session: AuthSession;
    refreshToken: string;
  }> {
    const session = this.authSessionRepository.create();

    session.user = user;
    await this.authSessionRepository.save(session);

    const { refreshToken } = await this.createRefreshToken(session);

    return { session, refreshToken };
  }

  /**
   * createRefreshToken should only be used while creating a new session.
   * @param session
   */
  private async createRefreshToken(
    session: AuthSession
  ): Promise<{ refreshToken: string }> {
    const payload = {
      sub: session.user.id,
      name: session.user.displayName,
    };

    const token = await this.jwtService.signAsync(payload, {
      jwtid: session.id,
      // jwtService uses the shorter access token time as a default
      expiresIn: this.sessionExpirationTime,
    });

    return { refreshToken: token };
  }

  async createAccessToken(
    session: AuthSession
  ): Promise<{ accessToken: string }> {
    if (session.revokedAt) {
      throw new ForbiddenException("SessionIsRevoked");
    }

    const payload = {
      sub: session.user.id,
      name: session.user.displayName,
      picture: session.user.photo,
    };

    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }

  async findSession(id: string): Promise<AuthSession> {
    return this.authSessionRepository.findOneBy({ id });
  }

  async createApiToken(user: User, description: string): Promise<ApiToken> {
    const apiToken = this.apiTokenRepository.create();

    apiToken.user = user;
    apiToken.description = description;

    // TODO demagic 20
    const tokenBuffer = await new Promise<Buffer>((resolve, reject) =>
      randomBytes(20, (err, buf) => (err ? reject(err) : resolve(buf)))
    );
    apiToken.token = `lis${tokenBuffer.toString("hex")}`;

    await this.apiTokenRepository.save(apiToken);

    return apiToken;
  }

  async listApiTokens(user: User): Promise<ApiToken[]> {
    return this.apiTokenRepository.scoped.byUser(user).getMany();
  }

  async revokeApiToken(user: User, id: string): Promise<void> {
    const apiToken = await this.apiTokenRepository.findOneBy({ user, id });

    if (apiToken && apiToken.revokedAt == null) {
      apiToken.revokedAt = new Date();
      await this.apiTokenRepository.save(apiToken);
    }

    return;
  }

  async findApiToken(token: string): Promise<ApiToken> {
    return this.apiTokenRepository.findOneBy({ token });
  }

  async findUser(id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  allowedByUserFilter(spotifyID: string) {
    if (!this.userFilter) {
      return true;
    }

    const whitelistedIDs = this.userFilter.split(",");

    return whitelistedIDs.includes(spotifyID);
  }
}
