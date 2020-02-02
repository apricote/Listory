import { HttpModule, Module } from "@nestjs/common";
import { SpotifyAuthService } from "./spotify-auth.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        baseURL: "https://accounts.spotify.com/"
      })
    })
  ],
  providers: [SpotifyAuthService],
  exports: [SpotifyAuthService]
})
export class SpotifyAuthModule {}
