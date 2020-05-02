import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { MusicLibraryModule } from "../../music-library/music-library.module";
import { SpotifyApiModule } from "./spotify-api/spotify-api.module";
import { SpotifyService } from "./spotify.service";
import { ListensModule } from "../../listens/listens.module";
import { SpotifyAuthModule } from "./spotify-auth/spotify-auth.module";

@Module({
  imports: [
    UsersModule,
    ListensModule,
    MusicLibraryModule,
    SpotifyApiModule,
    SpotifyAuthModule,
  ],
  providers: [SpotifyService],
})
export class SpotifyModule {}
