import { Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { SchedulerService } from "./scheduler.service";
import { SpotifyModule } from "./spotify/spotify.module";

@Module({
  imports: [SpotifyModule],
  providers: [SchedulerService],
})
export class SourcesModule {}
