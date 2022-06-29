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

  @CrawlerSupervisorJob.Handle()
  async superviseImportJobs(): Promise<void> {
    this.logger.log("Starting crawler jobs");
    const users = await this.spotifyService.getCrawlableUserInfo();

    await Promise.all(
      users.map((user) =>
        this.importSpotifyJobService.sendOnce({ userID: user.id }, {}, user.id)
      )
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
