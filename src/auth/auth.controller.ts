import {
  Controller,
  Get,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { User } from "../users/user.entity";
import { AuthSession } from "./auth-session.entity";
import { AuthService } from "./auth.service";
import { COOKIE_REFRESH_TOKEN } from "./constants";
import { ReqUser } from "./decorators/req-user.decorator";
import { RefreshAccessTokenResponseDto } from "./dto/refresh-access-token-response.dto";
import {
  RefreshTokenAuthGuard,
  SpotifyAuthGuard,
} from "./guards/auth-strategies.guard";
import { SpotifyAuthFilter } from "./spotify.filter";

@Controller("api/v1/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

  @Get("spotify")
  @UseGuards(SpotifyAuthGuard)
  spotifyRedirect() {
    // User is redirected by AuthGuard
  }

  @Get("spotify/callback")
  @UseFilters(SpotifyAuthFilter)
  @UseGuards(SpotifyAuthGuard)
  async spotifyCallback(@ReqUser() user: User, @Res() res: Response) {
    const { refreshToken } = await this.authService.createSession(user);

    // Refresh token should not be accessible to frontend to reduce risk
    // of XSS attacks.
    res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, { httpOnly: true });

    // Redirect User to SPA
    res.redirect("/login/success?source=spotify");
  }

  @Post("token/refresh")
  @UseGuards(RefreshTokenAuthGuard)
  async refreshAccessToken(
    // With RefreshTokenAuthGuard the session is available instead of user
    @ReqUser() session: AuthSession
  ): Promise<RefreshAccessTokenResponseDto> {
    const { accessToken } = await this.authService.createAccessToken(session);

    return { accessToken };
  }
}
