import { PGBossModule } from "@apricote/nest-pg-boss";
import { Module } from "@nestjs/common";
import { ListensModule } from "../../listens/listens.module";
import { MusicLibraryModule } from "../../music-library/music-library.module";
import { UsersModule } from "../../users/users.module";
import { ImportSpotifyJob } from "../jobs";
import { SpotifyApiModule } from "./spotify-api/spotify-api.module";
import { SpotifyAuthModule } from "./spotify-auth/spotify-auth.module";
import { SpotifyService } from "./spotify.service";

@Module({
  imports: [
    PGBossModule.forJobs([ImportSpotifyJob]),
    UsersModule,
    ListensModule,
    MusicLibraryModule,
    SpotifyApiModule,
    SpotifyAuthModule,
  ],
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {
  constructor(private readonly spotifyService: SpotifyService) {}
}
