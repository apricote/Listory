import { PGBossModule } from "@apricote/nest-pg-boss";
import { Module } from "@nestjs/common";
import { TypeOrmRepositoryModule } from "../../database/entity-repository/typeorm-repository.module";
import { ListensModule } from "../../listens/listens.module";
import { MusicLibraryModule } from "../../music-library/music-library.module";
import { UsersModule } from "../../users/users.module";
import { ImportSpotifyJob } from "../jobs";
import {
  ImportController,
  ImportService,
  ProcessSpotifyExtendedStreamingHistoryListenJob,
  SpotifyExtendedStreamingHistoryListenRepository,
} from "./import-extended-streaming-history";
import { SpotifyApiModule } from "./spotify-api/spotify-api.module";
import { SpotifyAuthModule } from "./spotify-auth/spotify-auth.module";
import { SpotifyService } from "./spotify.service";

@Module({
  imports: [
    PGBossModule.forJobs([
      ImportSpotifyJob,
      ProcessSpotifyExtendedStreamingHistoryListenJob,
    ]),
    TypeOrmRepositoryModule.for([
      SpotifyExtendedStreamingHistoryListenRepository,
    ]),
    UsersModule,
    ListensModule,
    MusicLibraryModule,
    SpotifyApiModule,
    SpotifyAuthModule,
  ],
  providers: [SpotifyService, ImportService],
  controllers: [ImportController],
  exports: [SpotifyService],
})
export class SpotifyModule {}
