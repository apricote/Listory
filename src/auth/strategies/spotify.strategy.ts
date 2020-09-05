import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-spotify";
import { AuthService } from "../auth.service";
import { AuthStrategy } from "./strategies.enum";

@Injectable()
export class SpotifyStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.Spotify
) {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService
  ) {
    super({
      clientID: config.get<string>("SPOTIFY_CLIENT_ID"),
      clientSecret: config.get<string>("SPOTIFY_CLIENT_SECRET"),
      callbackURL: `${config.get<string>(
        "APP_URL"
      )}/api/v1/auth/spotify/callback`,
      scope: [
        "user-read-private",
        "user-read-email",
        "user-read-recently-played",
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return await this.authService.spotifyLogin({
      accessToken,
      refreshToken,
      profile,
    });
  }
}
