import { Module } from "@nestjs/common";
import { PGBossModule } from "@apricote/nest-pg-boss";
import {
  CrawlerSupervisorJob,
  ImportSpotifyJob,
  UpdateSpotifyLibraryJob,
} from "./jobs";
import { SchedulerService } from "./scheduler.service";
import { SpotifyModule } from "./spotify/spotify.module";

@Module({
  imports: [
    SpotifyModule,
    PGBossModule.forJobs([
      CrawlerSupervisorJob,
      ImportSpotifyJob,
      UpdateSpotifyLibraryJob,
    ]),
  ],
  providers: [SchedulerService],
})
export class SourcesModule {}
