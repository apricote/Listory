import { BadRequestException, Injectable } from "@nestjs/common";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  endOfDay,
  formatISO,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  min,
  parseJSON,
  startOfDay,
  sub,
} from "date-fns";
import { ListensService } from "../listens/listens.service";
import { User } from "../users/user.entity";
import { GetListenReportDto } from "./dto/get-listen-report.dto";
import { GetTopAlbumsReportDto } from "./dto/get-top-albums-report.dto";
import { GetTopArtistsReportDto } from "./dto/get-top-artists-report.dto";
import { GetTopGenresReportDto } from "./dto/get-top-genres-report.dto";
import { GetTopTracksReportDto } from "./dto/get-top-tracks-report.dto";
import { ListenReportDto } from "./dto/listen-report.dto";
import { ReportTimeDto } from "./dto/report-time.dto";
import { TopAlbumsReportDto } from "./dto/top-albums-report.dto";
import { TopArtistsReportDto } from "./dto/top-artists-report.dto";
import { TopGenresReportDto as TopGenresReportDto } from "./dto/top-genres-report.dto";
import { TopTracksReportDto } from "./dto/top-tracks-report.dto";
import { Interval } from "./interval";
import { Timeframe } from "./timeframe.enum";
import { TimePreset } from "./timePreset.enum";

const timeframeToDateFns: {
  [x in Timeframe]: {
    eachOfInterval: (interval: Interval) => Date[];
    isSame: (dateLeft: Date, dateRight: Date) => boolean;
  };
} = {
  [Timeframe.Day]: {
    eachOfInterval: eachDayOfInterval,
    isSame: isSameDay,
  },
  [Timeframe.Week]: {
    eachOfInterval: eachWeekOfInterval,
    isSame: isSameWeek,
  },
  [Timeframe.Month]: {
    eachOfInterval: eachMonthOfInterval,
    isSame: isSameMonth,
  },
  [Timeframe.Year]: {
    eachOfInterval: eachYearOfInterval,
    isSame: isSameYear,
  },
};

const timePresetToDays: { [x in TimePreset]: number } = {
  [TimePreset.LAST_7_DAYS]: 7,
  [TimePreset.LAST_30_DAYS]: 30,
  [TimePreset.LAST_90_DAYS]: 90,
  [TimePreset.LAST_180_DAYS]: 180,
  [TimePreset.LAST_365_DAYS]: 365,
  [TimePreset.ALL_TIME]: 0, // Not used for this
  [TimePreset.CUSTOM]: 0, // Not used for this
};

@Injectable()
export class ReportsService {
  constructor(private readonly listensService: ListensService) {}

  async getListens(options: GetListenReportDto): Promise<ListenReportDto> {
    const { timeFrame, time: timePreset } = options;

    const listens = await this.getListensQueryFromOptions(options).getMany();

    const interval = this.getIntervalFromPreset(timePreset);
    const { eachOfInterval, isSame } = timeframeToDateFns[timeFrame];

    // Optimize performance for ALL_TIME by skipping eachOfInterval for time
    // between 1970 and first listen
    if (timePreset.timePreset === TimePreset.ALL_TIME) {
      let firstListen = min(listens.map(({ playedAt }) => playedAt));
      interval.start = startOfDay(firstListen);
    }

    // TODO: This code blocks the eventloop for multiple seconds if running for
    //       a large interval and with many listens. Refactor to make this more
    //       efficient or make pauses for event loop.
    const reportItems = eachOfInterval(interval).map((date) => {
      const count = listens.filter((listen) =>
        isSame(date, listen.playedAt)
      ).length;
      return { date: formatISO(date), count };
    });

    return { items: reportItems };
  }

  async getTopArtists(
    options: GetTopArtistsReportDto
  ): Promise<TopArtistsReportDto> {
    const getArtistsWithCountQB = this.getListensQueryFromOptions(options)
      .leftJoin("listen.track", "track")
      .leftJoinAndSelect("track.artists", "artists")
      .groupBy("artists.id")
      .select("artists.*")
      .addSelect("count(*) as listens")
      .orderBy("listens", "DESC");

    const rawArtistsWithCount = await getArtistsWithCountQB.getRawMany();

    const items: TopArtistsReportDto["items"] = rawArtistsWithCount.map(
      (data) => ({
        count: Number.parseInt(data.listens, 10),
        artist: {
          id: data.id,
          name: data.name,
          updatedAt: data.updatedAt,
          spotify: {
            id: data.spotifyId,
            uri: data.spotifyUri,
            type: data.spotifyType,
            href: data.spotifyHref,
          },
        },
      })
    );

    return {
      items,
    };
  }

  async getTopAlbums(
    options: GetTopAlbumsReportDto
  ): Promise<TopAlbumsReportDto> {
    const [rawAlbumsWithCount, rawAlbumDetails] = await Promise.all([
      this.getListensQueryFromOptions(options)
        .leftJoin("listen.track", "track")
        .leftJoinAndSelect("track.album", "album")
        .groupBy("album.id")
        .select("album.id")
        .addSelect("count(*) as listens")
        .orderBy("listens", "DESC")
        .getRawMany(),

      // Because of the GROUP BY required to calculate the count we can
      // not properly join the album relations in one query
      this.getListensQueryFromOptions(options)
        .leftJoinAndSelect("listen.track", "track")
        .leftJoinAndSelect("track.album", "album")
        .leftJoinAndSelect("album.artists", "artists")
        .distinctOn(["album.id"])
        .getMany(),
    ]);

    const albumDetails = rawAlbumDetails
      .map((listen) => listen.track.album)
      .filter((album) => album && album.artists); // Make sure entities are set

    const items: TopAlbumsReportDto["items"] = rawAlbumsWithCount.map(
      (data) => ({
        count: Number.parseInt(data.listens, 10),
        album: albumDetails.find((album) => album.id === data.album_id),
      })
    );

    return {
      items,
    };
  }

  async getTopTracks(
    options: GetTopTracksReportDto
  ): Promise<TopTracksReportDto> {
    const [rawTracksWithCount, rawTrackDetails] = await Promise.all([
      this.getListensQueryFromOptions(options)
        .leftJoin("listen.track", "track")
        .groupBy("track.id")
        .select("track.*")
        .addSelect("count(*) as listens")
        .orderBy("listens", "DESC")
        .getRawMany(),

      // Because of the GROUP BY required to calculate the count we can
      // not properly join the artist relations in one query
      this.getListensQueryFromOptions(options)
        .leftJoinAndSelect("listen.track", "track")
        .leftJoinAndSelect("track.artists", "artists")
        .distinctOn(["track.id"])
        .getMany(),
    ]);

    const trackDetails = rawTrackDetails
      .map((listen) => listen.track)
      .filter((track) => track); // Make sure entities are set

    const items: TopTracksReportDto["items"] = rawTracksWithCount.map(
      (data) => ({
        count: Number.parseInt(data.listens, 10),
        track: trackDetails.find((track) => track.id === data.id),
      })
    );

    return {
      items,
    };
  }

  async getTopGenres(
    options: GetTopGenresReportDto
  ): Promise<TopGenresReportDto> {
    const [rawGenresWithCount, rawGenresWithArtistsCount] = await Promise.all([
      this.getListensQueryFromOptions(options)
        .leftJoin("listen.track", "track")
        .leftJoin("track.artists", "artists")
        .leftJoin("artists.genres", "genres")
        .groupBy("genres.id")
        .select("genres.*")
        .addSelect("count(*) as listens")
        .orderBy("listens", "DESC")
        .getRawMany(),
      this.getListensQueryFromOptions(options)
        .leftJoin("listen.track", "track")
        .leftJoin("track.artists", "artists")
        .leftJoin("artists.genres", "genres")
        .groupBy("genres.id")
        .addGroupBy("artists.id")
        .select("genres.id", "genreID")
        .addSelect("artists.*")
        .addSelect("count(*) as listens")
        .orderBy("listens", "DESC")
        .getRawMany(),
    ]);

    const items: TopGenresReportDto["items"] = rawGenresWithCount
      .filter((rawGenre) => rawGenre.id) // Make sure that listen has related genre
      .map((data) => ({
        count: Number.parseInt(data.listens, 10),
        genre: {
          id: data.id,
          name: data.name,
        },
        artists: rawGenresWithArtistsCount
          .filter(({ genreID }) => genreID === data.id)
          .map((artistsData) => ({
            count: Number.parseInt(artistsData.listens, 10),
            artist: {
              id: artistsData.id,
              name: artistsData.name,
              updatedAt: artistsData.updatedAt,
              spotify: {
                id: artistsData.spotifyId,
                uri: artistsData.spotifyUri,
                type: artistsData.spotifyType,
                href: artistsData.spotifyHref,
              },
            },
          }))
          .filter((_, i) => i < 5),
      }));

    return {
      items,
    };
  }

  private getListensQueryFromOptions(options: {
    user: User;
    time: ReportTimeDto;
  }) {
    const { user, time: timePreset } = options;

    const interval = this.getIntervalFromPreset(timePreset);

    return this.listensService
      .getScopedQueryBuilder()
      .byUser(user)
      .duringInterval(interval);
  }

  private getIntervalFromPreset(options: {
    timePreset: TimePreset;
    customTimeStart?: string;
    customTimeEnd?: string;
  }): Interval {
    let interval = {
      start: startOfDay(new Date()),
      end: endOfDay(new Date()), // NOW
    };

    switch (options.timePreset) {
      case TimePreset.LAST_7_DAYS:
      case TimePreset.LAST_30_DAYS:
      case TimePreset.LAST_90_DAYS:
      case TimePreset.LAST_180_DAYS:
      case TimePreset.LAST_365_DAYS: {
        interval.start = startOfDay(
          sub(interval.start, { days: timePresetToDays[options.timePreset] })
        );
        break;
      }

      case TimePreset.ALL_TIME: {
        interval.start = new Date(0); // Start of epoch
        break;
      }

      case TimePreset.CUSTOM: {
        if (!options.customTimeStart && !options.customTimeEnd) {
          throw new BadRequestException("MissingCustomTime");
        }

        interval = {
          start: parseJSON(options.customTimeStart),
          end: parseJSON(options.customTimeEnd),
        };

        break;
      }

      default: {
        interval = this.getIntervalFromPreset({
          timePreset: TimePreset.LAST_7_DAYS,
        });
        break;
      }
    }

    return interval;
  }
}
