import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SchedulerRegistry } from "@nestjs/schedule";
import { captureException } from "@sentry/node";
import { Logger } from "../logger/logger.service";
import { SpotifyService } from "./spotify/spotify.service";

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  constructor(
    private readonly config: ConfigService,
    private readonly registry: SchedulerRegistry,
    private readonly spotifyService: SpotifyService,
    private readonly logger: Logger
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onApplicationBootstrap() {
    this.setupSpotifyCrawler();
  }

  private setupSpotifyCrawler() {
    const callback = () =>
      this.spotifyService.runCrawlerForAllUsers().catch((err) => {
        captureException(err);
        this.logger.error(`Spotify crawler loop crashed! ${err.stack}`);
      });
    const timeoutMs =
      this.config.get<number>("SPOTIFY_FETCH_INTERVAL_SEC") * 1000;

    const interval = setInterval(callback, timeoutMs);

    this.registry.addInterval("crawler_spotify", interval);
  }
}
