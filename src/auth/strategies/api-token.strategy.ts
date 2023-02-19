import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-http-bearer";
import { User } from "../../users/user.entity";
import { AuthService } from "../auth.service";
import { AuthStrategy } from "./strategies.enum";

@Injectable()
export class ApiTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.ApiToken
) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<User> {
    const apiToken = await this.authService.findApiToken(token);

    if (!apiToken) {
      throw new UnauthorizedException("TokenNotFound");
    }

    if (apiToken.revokedAt) {
      throw new ForbiddenException("TokenIsRevoked");
    }

    return apiToken.user;
  }
}
