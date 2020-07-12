import { TimeOptions } from "./time-options";

export interface ListenReportOptions {
  timeFrame: "day" | "week" | "month" | "year";
  time: TimeOptions;
}
