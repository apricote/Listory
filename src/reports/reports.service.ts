import { Injectable } from "@nestjs/common";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  formatISO,
  Interval,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  parseISO,
} from "date-fns";
import { ListensService } from "../listens/listens.service";
import { GetListenReportDto } from "./dto/get-listen-report.dto";
import { ListenReportDto } from "./dto/listen-report.dto";
import { Timeframe } from "./timeframe.enum";

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

@Injectable()
export class ReportsService {
  constructor(private readonly listensService: ListensService) {}

  async getListens(options: GetListenReportDto): Promise<ListenReportDto> {
    const { user, timeFrame, timeStart, timeEnd } = options;

    const { items: listens } = await this.listensService.getListens({
      user,
      filter: { time: { start: timeStart, end: timeEnd } },
      page: 1,
      limit: 10000000,
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
}
