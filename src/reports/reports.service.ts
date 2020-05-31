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
  parseISO,
  parseJSON,
  startOfDay,
  sub,
} from "date-fns";
import { ListensService } from "../listens/listens.service";
import { GetListenReportDto } from "./dto/get-listen-report.dto";
import { GetTopArtistsReportDto } from "./dto/get-top-artists-report.dto";
import { ListenReportDto } from "./dto/listen-report.dto";
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

const PAGINATION_LIMIT_UNLIMITED = 10000000;

@Injectable()
export class ReportsService {
  constructor(private readonly listensService: ListensService) {}

  async getListens(options: GetListenReportDto): Promise<ListenReportDto> {
    const { user, timeFrame, timeStart, timeEnd } = options;

    // Function should eventually be rewritten to accept a timepreset
    const interval = this.getIntervalFromPreset({
      timePreset: TimePreset.CUSTOM,
      customTimeStart: timeStart,
      customTimeEnd: timeEnd,
    });

    const { items: listens } = await this.listensService.getListens({
      user,
      filter: { time: interval },
      page: 1,
      limit: PAGINATION_LIMIT_UNLIMITED,
    });

    const reportInterval: Interval = {
      start: parseISO(timeStart),
      end: parseISO(timeEnd),
    };

    const { eachOfInterval, isSame } = timeframeToDateFns[timeFrame];

    const reportItems = eachOfInterval(reportInterval).map((date) => {
      const count = listens.filter((listen) => isSame(date, listen.playedAt))
        .length;
      return { date: formatISO(date), count };
    });

    return { items: reportItems, timeStart, timeEnd, timeFrame };
  }

  async getTopArtists(
    options: GetTopArtistsReportDto
  ): Promise<TopArtistsReportDto> {
    const { user, timePreset, customTimeStart, customTimeEnd } = options;

    const interval = this.getIntervalFromPreset({
      timePreset,
      customTimeStart,
      customTimeEnd,
    });

    const { items: listens } = await this.listensService.getListens({
      user,
      filter: { time: interval },
      page: 1,
      limit: PAGINATION_LIMIT_UNLIMITED,
    });

    // Declare types for metrics calculation
    type Item = TopArtistsReportDto["items"][0];
    type Accumulator = {
      [x: string]: Item;
    };

    const items: TopArtistsReportDto["items"] = Object.values<Item>(
      listens
        .flatMap((listen) => listen.track.artists)
        .reduce<Accumulator>((counters, artist) => {
          if (!counters[artist.id]) {
            counters[artist.id] = {
              artist,
              count: 0,
            };
          }

          counters[artist.id].count += 1;

          return counters;
        }, {})
    )
      .sort((a, b) => a.count - b.count)
      .reverse() // sort descending
      .slice(0, 20); // TODO: Make configurable

    return { items };
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
