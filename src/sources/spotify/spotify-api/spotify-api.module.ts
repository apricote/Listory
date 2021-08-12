import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SpotifyApiService } from "./spotify-api.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        timeout: 5000,
        baseURL: config.get<string>("SPOTIFY_WEB_API_URL"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SpotifyApiService],
  exports: [SpotifyApiService],
})
export class SpotifyApiModule {}
