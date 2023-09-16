import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { JwtFromRequestFunction, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { COOKIE_REFRESH_TOKEN } from "../constants";
import { AuthStrategy } from "./strategies.enum";
import { AuthSession } from "../auth-session.entity";

const extractJwtFromCookie: JwtFromRequestFunction = (req) => {
  const token = req.cookies[COOKIE_REFRESH_TOKEN] || null;
  return token;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.RefreshToken,
) {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: { jti: string }): Promise<AuthSession> {
    const session = await this.authService.findSession(payload.jti);

    if (!session) {
      throw new UnauthorizedException("SessionNotFound");
    }

    if (session.revokedAt) {
      throw new ForbiddenException("SessionIsRevoked");
    }

    return session;
  }
}
