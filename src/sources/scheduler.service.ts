import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SchedulerRegistry } from "@nestjs/schedule";
import { captureException } from "@sentry/node";
import { SpotifyService } from "./spotify/spotify.service";

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly config: ConfigService,
    private readonly registry: SchedulerRegistry,
    private readonly spotifyService: SpotifyService
  ) {}

  onApplicationBootstrap() {
    this.setupSpotifyCrawler();
    this.setupSpotifyMusicLibraryUpdater();
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

  private setupSpotifyMusicLibraryUpdater() {
    const callback = () => {
      this.spotifyService.runUpdaterForAllEntities();
    };
    const timeoutMs =
      this.config.get<number>("SPOTIFY_UPDATE_INTERVAL_SEC") * 1000;

    const interval = setInterval(callback, timeoutMs);

    this.registry.addInterval("updater_spotify", interval);
  }
}
