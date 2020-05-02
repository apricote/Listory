import { HttpModule, Module } from "@nestjs/common";
import { SpotifyApiService } from "./spotify-api.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        baseURL: "https://api.spotify.com/",
      }),
    }),
  ],
  providers: [SpotifyApiService],
  exports: [SpotifyApiService],
})
export class SpotifyApiModule {}
