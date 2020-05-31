import React from "react";
import { TimePreset } from "../api/entities/time-preset.enum";
import { TopArtistsOptions } from "../api/entities/top-artists-options";
import { DateSelect } from "./inputs/DateSelect";

interface ReportOptionsProps {
  reportOptions: TopArtistsOptions;
  setReportOptions: (options: TopArtistsOptions) => void;
}

const timePresetOptions = [
  { value: TimePreset.LAST_7_DAYS, description: "Last 7 days" },
  { value: TimePreset.LAST_30_DAYS, description: "Last 30 days" },
  { value: TimePreset.LAST_90_DAYS, description: "Last 90 days" },
  { value: TimePreset.LAST_180_DAYS, description: "Last 180 days" },
  { value: TimePreset.LAST_365_DAYS, description: "Last 365 days" },
  { value: TimePreset.ALL_TIME, description: "All time" },
  { value: TimePreset.CUSTOM, description: "Custom" },
];

export const ReportOptions: React.FC<ReportOptionsProps> = ({
  reportOptions,
  setReportOptions,
}) => {
  return (
    <div className="md:flex">
      <div className="text-gray-700">
        <label className="text-sm">Timeframe</label>
        <select
          className="block appearance-none min-w-full md:w-1/4 bg-white border border-gray-400 hover:border-gray-500 p-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) =>
            setReportOptions({
              ...reportOptions,
              timePreset: e.target.value as TimePreset,
            })
          }
        >
          {timePresetOptions.map(({ value, description }) => (
            <option value={value} key={value}>
              {description}
            </option>
          ))}
        </select>
      </div>
      {reportOptions.timePreset === TimePreset.CUSTOM && (
        <div className="md:flex text-gray-700">
          <DateSelect
            label="Start"
            value={reportOptions.customTimeStart}
            onChange={(newDate) =>
              setReportOptions({ ...reportOptions, customTimeStart: newDate })
            }
          />
          <DateSelect
            label="End"
            value={reportOptions.customTimeEnd}
            onChange={(newDate) =>
              setReportOptions({ ...reportOptions, customTimeEnd: newDate })
            }
          />
        </div>
      )}
    </div>
  );
};
