import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { AuthStrategy } from "./strategies.enum";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.AccessToken
) {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: { sub: string }) {
    return this.authService.findUser(payload.sub);
  }
}
