import { AxisBottom, AxisLeft } from "@vx/axis";
import { curveBasis } from "@vx/curve";
import { GradientLightgreenGreen } from "@vx/gradient";
import { Grid } from "@vx/grid";
import { Group } from "@vx/group";
import { scaleLinear, scaleTime } from "@vx/scale";
import { Area, Line, LinePath } from "@vx/shape";
import { extent } from "d3-array";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
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
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}> = ({
  options,
  data,
  width = 900,
  height = 500,
  margin = { left: 70, right: 70, top: 20, bottom: 80 },
}) => {
  // Then we'll create some bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // We'll make some helpers to get at the data we want
  const x = (d: ListenReportItem) => d.date;
  const y = (d: ListenReportItem) => d.count;

  // responsive utils for axis ticks
  const numTicksForHeight = (heightT: number): number => {
    if (heightT <= 300) return 3;
    if (300 < heightT && heightT <= 600) return 5;
    return 10;
  };

  const numTicksForWidth = (widthT: number): number => {
    if (widthT <= 300) return 2;
    if (300 < widthT && widthT <= 400) return 5;
    return 10;
  };

  // And then scale the graph by our data
  const xScaleTime = scaleTime<number>({
    range: [0, xMax],
    domain: extent(data, x) as [Date, Date],
  });

  /*
  const xScaleBand = scaleBand({
     range: [0, xMax],
     domain: extent(data, x) as [Date, Date],
     padding: 0.2,
   });
   */
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, Math.max(...data.map(y))],
    nice: true,
  });

  // Compose together the scale and accessor functions to get point functions
  const compose = (scale: any, accessor: any) => (d: ListenReportItem) =>
    scale(accessor(d));
  const xPoint = compose(xScaleTime, x);
  const yPoint = compose(yScale, y);

  return (
    <svg width={width} height={height}>
      <GradientLightgreenGreen
        id="linear"
        vertical={false}
        fromOpacity={0.8}
        toOpacity={0.8}
      />
      <Grid
        top={margin.top}
        left={margin.left}
        xScale={xScaleTime}
        yScale={yScale}
        stroke="rgba(142, 32, 95, 0.9)"
        width={xMax}
        height={yMax}
        numTicksRows={numTicksForHeight(height)}
        numTicksColumns={numTicksForWidth(width)}
      />
      <Group top={margin.top} left={margin.left}>
        <Area
          data={data}
          x={(d) => xScaleTime(x(d))}
          y0={(d) => yScale.range()[0]}
          y1={(d) => yScale(y(d))}
          strokeWidth={2}
          stroke={"transparent"}
          fill={"url(#linear)"}
          curve={curveBasis}
        />
        <LinePath
          data={data}
          x={(d) => xScaleTime(x(d))}
          y={(d) => yScale(y(d))}
          stroke={"url('#linear')"}
          strokeWidth={2}
          curve={curveBasis}
        />
      </Group>
      <Group left={margin.left}>
        <AxisLeft
          top={margin.top}
          left={0}
          scale={yScale}
          hideZero
          numTicks={numTicksForHeight(height)}
          label="Axis Left Label"
          labelProps={{
            fill: "#8e205f",
            textAnchor: "middle",
            fontSize: 12,
          }}
          stroke="#1b1a1e"
          tickStroke="#8e205f"
          tickLabelProps={(value, index) => ({
            fill: "#8e205f",
            textAnchor: "end",
            fontSize: 10,
            dx: "-0.25em",
            dy: "0.25em",
          })}
          tickComponent={({ formattedValue, ...tickProps }) => (
            <text {...tickProps}>{formattedValue}</text>
          )}
        />
        />
        <AxisBottom
          top={height - margin.bottom}
          left={0}
          scale={xScaleTime}
          numTicks={numTicksForWidth(width)}
          label="Time"
        >
          {(axis) => {
            const tickLabelSize = 10;
            const tickRotate = 45;
            const tickColor = "#8e205f";
            const axisCenter = (axis.axisToPoint.x - axis.axisFromPoint.x) / 2;
            return (
              <g className="my-custom-bottom-axis">
                {axis.ticks.map((tick, i) => {
                  const tickX = tick.to.x;
                  const tickY = tick.to.y + tickLabelSize + axis.tickLength;
                  return (
                    <Group
                      key={`vx-tick-${tick.value}-${i}`}
                      className={"vx-axis-tick"}
                    >
                      <Line from={tick.from} to={tick.to} stroke={tickColor} />
                      <text
                        transform={`translate(${tickX}, ${tickY}) rotate(${tickRotate})`}
                        fontSize={tickLabelSize}
                        textAnchor="middle"
                        fill={tickColor}
                      >
                        {tick.formattedValue}
                      </text>
                    </Group>
                  );
                })}
                <text
                  textAnchor="middle"
                  transform={`translate(${axisCenter}, 50)`}
                  fontSize="8"
                >
                  {axis.label}
                </text>
              </g>
            );
          }}
        </AxisBottom>
      </Group>
    </svg>
  );
};
