import { JobService } from "@apricote/nest-pg-boss";
import { Injectable, Logger } from "@nestjs/common";
import { uniq } from "lodash";
import { Span } from "nestjs-otel";
import type { Job } from "pg-boss";
import { ListensService } from "../../../listens/listens.service";
import { User } from "../../../users/user.entity";
import { SpotifyService } from "../spotify.service";
import { ExtendedStreamingHistoryStatusDto } from "./dto/extended-streaming-history-status.dto";
import { ImportExtendedStreamingHistoryDto } from "./dto/import-extended-streaming-history.dto";
import {
  IProcessSpotifyExtendedStreamingHistoryListenJob,
  ProcessSpotifyExtendedStreamingHistoryListenJob,
} from "./jobs";
import { SpotifyExtendedStreamingHistoryListenRepository } from "./listen.repository";

@Injectable()
export class ImportService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly importListenRepository: SpotifyExtendedStreamingHistoryListenRepository,
    @ProcessSpotifyExtendedStreamingHistoryListenJob.Inject()
    private readonly processListenJobService: JobService<IProcessSpotifyExtendedStreamingHistoryListenJob>,
    private readonly spotifyService: SpotifyService,
    private readonly listensService: ListensService,
  ) {}

  @Span()
  async importExtendedStreamingHistory(
    user: User,
    { listens: importListens }: ImportExtendedStreamingHistoryDto,
  ): Promise<void> {
    // IDK what's happening, but my personal data set has entries with duplicate
    // listens? might be related to offline mode.
    // Anyway, this cleans it up:
    const uniqEntries = new Set();
    const uniqueListens = importListens.filter((listen) => {
      const key = `${listen.spotify_track_uri}-${listen.ts}`;

      if (!uniqEntries.has(key)) {
        // New entry
        uniqEntries.add(key);
        return true;
      }

      return false;
    });

    let listens = uniqueListens.map((listenData) =>
      this.importListenRepository.create({
        user,
        playedAt: new Date(listenData.ts),
        spotifyTrackUri: listenData.spotify_track_uri,
      }),
    );

    // Save listens to import table
    const insertResult = await this.importListenRepository.upsert(listens, [
      "user",
      "playedAt",
      "spotifyTrackUri",
    ]);

    const processJobs = insertResult.identifiers.map((listen) => ({
      data: {
        id: listen.id,
      },
      singletonKey: listen.id,
      retryLimit: 10,
      retryDelay: 5,
      retryBackoff: true,
    }));

    // Schedule jobs to process imports
    await this.processListenJobService.insert(processJobs);
  }

  @ProcessSpotifyExtendedStreamingHistoryListenJob.Handle({
    // Spotify API "Get Several XY" allows max 50 IDs
    batchSize: 50,
    newJobCheckInterval: 500,
  })
  @Span()
  async processListens(
    jobs: Job<IProcessSpotifyExtendedStreamingHistoryListenJob>[],
  ): Promise<void> {
    this.logger.debug(
      { jobs: jobs.length },
      "processing extended streaming history listens",
    );
    const importListens = await this.importListenRepository.findBy(
      jobs.map((job) => ({ id: job.data.id })),
    );

    const listensWithoutTracks = importListens.filter(
      (importListen) => !importListen.track,
    );
    if (listensWithoutTracks.length > 0) {
      const missingTrackIDs = uniq(
        listensWithoutTracks.map((importListen) =>
          importListen.spotifyTrackUri.replace("spotify:track:", ""),
        ),
      );

      const tracks = await this.spotifyService.importTracks(missingTrackIDs);

      listensWithoutTracks.forEach((listen) => {
        listen.track = tracks.find(
          (track) => listen.spotifyTrackUri === track.spotify.uri,
        );
        if (!listen.track) {
          this.logger.warn(
            { listen },
            "could not find track for extended streaming history listen",
          );
          throw new Error(
            `could not find track for extended streaming history listen`,
          );
        }
      });

      // Using upsert instead of save to only do a single query
      await this.importListenRepository.upsert(listensWithoutTracks, ["id"]);
    }

    const listensWithoutListen = importListens.filter(
      (importListen) => !importListen.listen,
    );
    if (listensWithoutListen.length > 0) {
      const listens = await this.listensService.createListens(
        listensWithoutListen.map((listen) => ({
          user: listen.user,
          track: listen.track,
          playedAt: listen.playedAt,
        })),
      );

      listensWithoutListen.forEach((importListen) => {
        importListen.listen = listens.find(
          (listen) =>
            importListen.user.id === listen.user.id &&
            importListen.track.id === listen.track.id &&
            importListen.playedAt.getTime() === listen.playedAt.getTime(),
        );
        if (!importListen.listen) {
          this.logger.warn(
            { listen: importListen, listens: listens },
            "could not find listen for extended streaming history listen",
          );
          throw new Error(
            `could not find listen for extended streaming history listen`,
          );
        }
      });

      // Using upsert instead of save to only do a single query
      await this.importListenRepository.upsert(listensWithoutListen, ["id"]);
    }
  }

  @Span()
  async getExtendedStreamingHistoryStatus(
    user: User,
  ): Promise<ExtendedStreamingHistoryStatusDto> {
    const qb = this.importListenRepository
      .createQueryBuilder("listen")
      .where("listen.userId = :user", { user: user.id });

    const [total, imported] = await Promise.all([
      qb.clone().getCount(),
      qb.clone().andWhere("listen.listenId IS NOT NULL").getCount(),
    ]);

    return { total, imported };
  }
}
