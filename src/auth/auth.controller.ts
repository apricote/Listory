import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { User } from "../users/user.entity";
import { ApiToken } from "./api-token.entity";
import { AuthSession } from "./auth-session.entity";
import { AuthService } from "./auth.service";
import { COOKIE_REFRESH_TOKEN } from "./constants";
import { AuthAccessToken } from "./decorators/auth-access-token.decorator";
import { ReqUser } from "./decorators/req-user.decorator";
import { CreateApiTokenRequestDto } from "./dto/create-api-token-request.dto";
import { RefreshAccessTokenResponseDto } from "./dto/refresh-access-token-response.dto";
import { RevokeApiTokenRequestDto } from "./dto/revoke-api-token-request.dto";
import {
  RefreshTokenAuthGuard,
  SpotifyAuthGuard,
} from "./guards/auth-strategies.guard";
import { SpotifyAuthFilter } from "./spotify.filter";

@ApiTags("auth")
@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post("api-tokens")
  @ApiBody({ type: CreateApiTokenRequestDto })
  @AuthAccessToken()
  async createApiToken(
    @ReqUser() user: User,
    @Body("description") description: string
  ): Promise<ApiToken> {
    return this.authService.createApiToken(user, description);
  }

  @Get("api-tokens")
  @AuthAccessToken()
  async listApiTokens(@ReqUser() user: User): Promise<ApiToken[]> {
    return this.authService.listApiTokens(user);
  }

  // This endpoint does not validate that the token belongs to the logged in user.
  // Once the token is known, it does not matter which account makes the actual
  // request to revoke it.
  @Delete("api-tokens")
  @ApiBody({ type: RevokeApiTokenRequestDto })
  @AuthAccessToken()
  async revokeApiToken(@Body("token") token: string): Promise<void> {
    return this.authService.revokeApiToken(token);
  }
}
