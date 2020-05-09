import { format, getTime } from "date-fns";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getListensReport } from "../api/api";
import { ListenReportItem } from "../api/entities/listen-report-item";
import { ListenReportOptions } from "../api/entities/listen-report-options";
import { useAuth } from "../hooks/use-auth";

export const ReportListens: React.FC = () => {
  const { user } = useAuth();

  const [reportOptions, setReportOptions] = useState<ListenReportOptions>({
    timeFrame: "day",
    timeStart: new Date("2020-05-01"),
    timeEnd: new Date(),
  });
  const [report, setReport] = useState<ListenReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const reportFromApi = await getListensReport(reportOptions);
        setReport(reportFromApi);
      } catch (err) {
        console.error("Error while fetching recent listens:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reportOptions, setReport, setIsLoading]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:flex-shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700">Listen Report</p>
        </div>
        <div>
          {isLoading && (
            <div>
              <span>Loading Listens</span>
            </div>
          )}
          {report.length === 0 && (
            <div>
              <p>Report is emtpy! :(</p>
            </div>
          )}
          {report.length > 0 && (
            <div className="table-auto my-2 w-full text-gray-700">
              <ReportGraph options={reportOptions} data={report} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportGraph: React.FC<{
  options: ListenReportOptions;
  data: ListenReportItem[];
}> = ({ options, data }) => {
  const dataLocal = data.map(({ date, ...other }) => ({
    ...other,
    date: getTime(date),
  }));

  return (
    <ResponsiveContainer width="90%" height={400}>
      <AreaChart
        data={dataLocal}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#48bb78" stopOpacity={0.8} />
            <stop offset="90%" stopColor="#48bb78" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          scale="time"
          type="number"
          domain={["auto", "auto"]}
          dataKey="date"
          tickFormatter={(date) => format(date, "P")}
        />
        <YAxis />
        <Tooltip separator=": " formatter={(value) => [value, "Listens"]} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#48bb78"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
