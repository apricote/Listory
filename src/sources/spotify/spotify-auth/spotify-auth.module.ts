import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SpotifyAuthService } from "./spotify-auth.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        timeout: 5000,
        baseURL: config.get<string>("SPOTIFY_AUTH_API_URL"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SpotifyAuthService],
  exports: [SpotifyAuthService],
})
export class SpotifyAuthModule {}
