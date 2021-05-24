import { format, getTime } from "date-fns";
import React, { useMemo, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { ListenReportItem } from "../api/entities/listen-report-item";
import { ListenReportOptions } from "../api/entities/listen-report-options";
import { TimeOptions } from "../api/entities/time-options";
import { TimePreset } from "../api/entities/time-preset.enum";
import { useListensReport } from "../hooks/use-api";
import { useAuth } from "../hooks/use-auth";
import { ReportTimeOptions } from "./ReportTimeOptions";

export const ReportListens: React.FC = () => {
  const { user } = useAuth();

  const [timeFrame, setTimeFrame] = useState<"day" | "week" | "month" | "year">(
    "day"
  );

  const [timeOptions, setTimeOptions] = useState<TimeOptions>({
    timePreset: TimePreset.LAST_7_DAYS,
    customTimeStart: new Date(0),
    customTimeEnd: new Date(),
  });

  const reportOptions = useMemo(() => ({ timeFrame, time: timeOptions }), [
    timeFrame,
    timeOptions,
  ]);

  const { report, isLoading } = useListensReport(reportOptions);

  const reportHasItems = !isLoading && report.length !== 0;

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:flex-shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700">Listen Report</p>
        </div>
        <div className="shadow-xl bg-gray-100 rounded p-5 m-2">
          <div className="md:flex">
            <div className="text-gray-700">
              <label className="text-sm">Timeframe</label>
              <select
                className="block appearance-none min-w-full md:win-w-0 md:w-1/4 bg-white border border-gray-400 hover:border-gray-500 p-2 rounded shadow leading-tight focus:outline-none focus:ring"
                onChange={(e) =>
                  setTimeFrame(
                    e.target.value as "day" | "week" | "month" | "year"
                  )
                }
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <ReportTimeOptions
              timeOptions={timeOptions}
              setTimeOptions={setTimeOptions}
            />
          </div>
          {isLoading && (
            <div>
              <div className="loader rounded-full border-8 h-64 w-64"></div>
            </div>
          )}
          {!reportHasItems && (
            <div>
              <p>Report is emtpy! :(</p>
            </div>
          )}
          {reportHasItems && (
            <div className="w-full text-gray-700 mt-5">
              <ReportGraph timeFrame={timeFrame} data={report} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportGraph: React.FC<{
  timeFrame: ListenReportOptions["timeFrame"];
  data: ListenReportItem[];
}> = ({ timeFrame, data }) => {
  const dataLocal = data.map(({ date, ...other }) => ({
    ...other,
    date: getTime(date),
  }));

  const ReportTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (!active || payload === undefined) {
      return null;
    }

    const [{ value: listens }] = payload;
    const date = format(label as number, dateFormatFromTimeFrame(timeFrame));

    return (
      <div className="bg-gray-100 shadow-xl p-2 rounded text-sm font-light">
        <p>{date}</p>
        <p>
          Listens: <span className="font-bold">{listens}</span>
        </p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={dataLocal}
          margin={{
            left: -20,
          }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#48bb78" stopOpacity={0.8} />
              <stop offset="90%" stopColor="#48bb78" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            scale="time"
            type="number"
            domain={["auto", "auto"]}
            dataKey="date"
            tickFormatter={(date) =>
              format(date, shortDateFormatFromTimeFrame(timeFrame))
            }
          />
          <YAxis />
          <Tooltip content={ReportTooltip} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#48bb78"
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const shortDateFormatFromTimeFrame = (
  timeFrame: "day" | "week" | "month" | "year"
): string => {
  const FORMAT_DAY = "P";
  const FORMAT_WEEK = "'Week' w yyyy";
  const FORMAT_MONTH = "LLL yyyy";
  const FORMAT_YEAR = "yyyy";
  const FORMAT_DEFAULT = FORMAT_DAY;

  switch (timeFrame) {
    case "day":
      return FORMAT_DAY;
    case "week":
      return FORMAT_WEEK;
    case "month":
      return FORMAT_MONTH;
    case "year":
      return FORMAT_YEAR;
    default:
      return FORMAT_DEFAULT;
  }
};

const dateFormatFromTimeFrame = (
  timeFrame: "day" | "week" | "month" | "year"
): string => {
  const FORMAT_DAY = "PPPP";
  const FORMAT_WEEK = "'Week starting on' PPPP";
  const FORMAT_MONTH = "LLLL yyyy";
  const FORMAT_YEAR = "yyyy";
  const FORMAT_DEFAULT = FORMAT_DAY;

  switch (timeFrame) {
    case "day":
      return FORMAT_DAY;
    case "week":
      return FORMAT_WEEK;
    case "month":
      return FORMAT_MONTH;
    case "year":
      return FORMAT_YEAR;
    default:
      return FORMAT_DEFAULT;
  }
};
