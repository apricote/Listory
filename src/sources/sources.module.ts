import { Module } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { SpotifyModule } from "./spotify/spotify.module";

@Module({
  imports: [SpotifyModule],
  providers: [SchedulerService],
})
export class SourcesModule {}
