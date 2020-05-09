import { Timeframe } from "../timeframe.enum";

export class ListenReportDto {
  items: {
    date: string;
    count: number;
  }[];

  timeFrame: Timeframe;

  timeStart: string;

  timeEnd: string;
}
