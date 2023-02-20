import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { User } from "../users/user.entity";
import { AuthSession } from "./auth-session.entity";
import { AuthService } from "./auth.service";
import { COOKIE_REFRESH_TOKEN } from "./constants";
import { AuthAccessToken } from "./decorators/auth-access-token.decorator";
import { ReqUser } from "./decorators/req-user.decorator";
import { ApiTokenDto } from "./dto/api-token.dto";
import { CreateApiTokenRequestDto } from "./dto/create-api-token-request.dto";
import { NewApiTokenDto } from "./dto/new-api-token.dto";
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
  ): Promise<NewApiTokenDto> {
    const apiToken = await this.authService.createApiToken(user, description);

    return {
      id: apiToken.id,
      description: apiToken.description,
      token: apiToken.token,
      createdAt: apiToken.createdAt,
    };
  }

  @Get("api-tokens")
  @AuthAccessToken()
  async listApiTokens(@ReqUser() user: User): Promise<ApiTokenDto[]> {
    const apiTokens = await this.authService.listApiTokens(user);

    return apiTokens.map((apiToken) => ({
      id: apiToken.id,
      description: apiToken.description,
      prefix: apiToken.token.slice(0, 12),
      createdAt: apiToken.createdAt,
      revokedAt: apiToken.revokedAt,
    }));
  }

  @Delete("api-tokens/:id")
  @ApiBody({ type: RevokeApiTokenRequestDto })
  @AuthAccessToken()
  async revokeApiToken(
    @ReqUser() user: User,
    @Param("id") id: string
  ): Promise<void> {
    return this.authService.revokeApiToken(user, id);
  }
}
