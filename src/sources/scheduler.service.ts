import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SpotifyService } from "./spotify/spotify.service";
import {
  CrawlerSupervisorJob,
  ICrawlerSupervisorJob,
  IImportSpotifyJob,
  ImportSpotifyJob,
  IUpdateSpotifyLibraryJob,
  UpdateSpotifyLibraryJob,
} from "./jobs";
import { JobService } from "@apricote/nest-pg-boss";
import { Span } from "nestjs-otel";

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly config: ConfigService,
    private readonly spotifyService: SpotifyService,
    @CrawlerSupervisorJob.Inject()
    private readonly superviseImportJobsJobService: JobService<ICrawlerSupervisorJob>,
    @ImportSpotifyJob.Inject()
    private readonly importSpotifyJobService: JobService<IImportSpotifyJob>,
    @UpdateSpotifyLibraryJob.Inject()
    private readonly updateSpotifyLibraryJobService: JobService<IUpdateSpotifyLibraryJob>
  ) {}

  async onApplicationBootstrap() {
    await this.setupSpotifyCrawlerSupervisor();
    await this.setupSpotifyMusicLibraryUpdater();
  }

  private async setupSpotifyCrawlerSupervisor(): Promise<void> {
    await this.superviseImportJobsJobService.schedule("*/1 * * * *", {}, {});
  }

  @Span()
  @CrawlerSupervisorJob.Handle()
  async superviseImportJobs(): Promise<void> {
    this.logger.log("Starting crawler jobs");
    const userInfo = await this.spotifyService.getCrawlableUserInfo();

    // To save on Spotify API requests we have two different classes of polling intervals:
    // - all users are polled at least every 10 minutes, this is a safe interval
    //   and no listens will be ever missed
    // - if a user listened to a song within the last 60 minutes, we poll every
    //   minute to ensure that the UI shows new listens immediately
    const POLL_RATE_INACTIVE_SEC = 10 * 60;
    const POLL_RATE_ACTIVE_SEC = 1 * 60;

    const INACTIVE_CUTOFF_MSEC = 60 * 60 * 1000;

    await Promise.all(
      userInfo.map(({ user, lastListen }) => {
        let pollRate = POLL_RATE_INACTIVE_SEC;

        const timeSinceLastListen = new Date().getTime() - lastListen.getTime();
        if (timeSinceLastListen < INACTIVE_CUTOFF_MSEC) {
          pollRate = POLL_RATE_ACTIVE_SEC;
        }

        this.importSpotifyJobService.sendThrottled(
          { userID: user.id },
          {},
          pollRate,
          user.id
        );
      })
    );
  }

  private async setupSpotifyMusicLibraryUpdater() {
    await this.updateSpotifyLibraryJobService.schedule("*/1 * * * *", {}, {});
  }

  @UpdateSpotifyLibraryJob.Handle()
  async updateSpotifyLibrary() {
    this.spotifyService.runUpdaterForAllEntities();
  }
}
