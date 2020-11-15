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
  parseJSON,
  startOfDay,
  sub,
} from "date-fns";
import { ListensService } from "../listens/listens.service";
import { GetListenReportDto } from "./dto/get-listen-report.dto";
import { GetTopAlbumsReportDto } from "./dto/get-top-albums-report.dto";
import { GetTopArtistsReportDto } from "./dto/get-top-artists-report.dto";
import { ListenReportDto } from "./dto/listen-report.dto";
import { TopAlbumsReportDto } from "./dto/top-albums-report.dto";
import { TopArtistsReportDto } from "./dto/top-artists-report.dto";
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
    const { user, timeFrame, time: timePreset } = options;

    const interval = this.getIntervalFromPreset(timePreset);

    const listens = await this.listensService
      .getScopedQueryBuilder()
      .byUser(user)
      .duringInterval(interval)
      .getMany();

    const { eachOfInterval, isSame } = timeframeToDateFns[timeFrame];

    const reportItems = eachOfInterval(interval).map((date) => {
      const count = listens.filter((listen) => isSame(date, listen.playedAt))
        .length;
      return { date: formatISO(date), count };
    });

    return { items: reportItems };
  }

  async getTopArtists(
    options: GetTopArtistsReportDto
  ): Promise<TopArtistsReportDto> {
    const { user, time: timePreset } = options;

    const interval = this.getIntervalFromPreset(timePreset);

    const getArtistsWithCountQB = this.listensService
      .getScopedQueryBuilder()
      .byUser(user)
      .duringInterval(interval)
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
    const { user, time: timePreset } = options;

    const interval = this.getIntervalFromPreset(timePreset);

    const getListensQB = () =>
      this.listensService
        .getScopedQueryBuilder()
        .byUser(user)
        .duringInterval(interval);

    const [rawAlbumsWithCount, rawAlbumDetails] = await Promise.all([
      getListensQB()
        .leftJoin("listen.track", "track")
        .leftJoinAndSelect("track.album", "album")
        .groupBy("album.id")
        .select("album.id")
        .addSelect("count(*) as listens")
        .orderBy("listens", "DESC")
        .getRawMany(),

      // Because of the GROUP BY required to calculate the count we can
      // not properly join the album relations in one query
      getListensQB()
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
    }

    return interval;
  }
}
