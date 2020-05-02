import { Controller, Get, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { User } from "../users/user.entity";
import { AuthService } from "./auth.service";
import { ReqUser } from "./decorators/req-user.decorator";
import { SpotifyAuthFilter } from "./spotify.filter";

@Controller("api/v1/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

  @Get("spotify")
  @UseGuards(AuthGuard("spotify"))
  spotifyRedirect() {
    // User is redirected by AuthGuard
  }

  @Get("spotify/callback")
  @UseFilters(SpotifyAuthFilter)
  @UseGuards(AuthGuard("spotify"))
  async spotifyCallback(@ReqUser() user: User, @Res() res: Response) {
    const { accessToken } = await this.authService.createToken(user);

    // Transmit accessToken to Frontend
    res.cookie("listory_access_token", accessToken, {
      // SPA will directly read cookie, save it to local storage and delete it
      // 15 Minutes should be enough
      maxAge: 15 * 60 * 1000,

      // Must be readable by SPA
      httpOnly: false,
    });

    // Redirect User to SPA
    res.redirect("/login/success?type=spotify");
  }
}
