import React from "react";
import { TimeOptions } from "../api/entities/time-options";
import { TimePreset } from "../api/entities/time-preset.enum";
import { DateSelect } from "./inputs/DateSelect";

interface ReportTimeOptionsProps {
  timeOptions: TimeOptions;
  setTimeOptions: (options: TimeOptions) => void;
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

export const ReportTimeOptions: React.FC<ReportTimeOptionsProps> = ({
  timeOptions,
  setTimeOptions,
}) => {
  return (
    <div className="md:flex mb-4">
      <div className="text-gray-700">
        <label className="text-sm">Timeframe</label>
        <select
          className="block appearance-none min-w-full md:w-1/4 bg-white border border-gray-400 hover:border-gray-500 p-2 rounded shadow leading-tight focus:outline-none focus:ring"
          onChange={(e) =>
            setTimeOptions({
              ...timeOptions,
              timePreset: e.target.value as TimePreset,
            })
          }
          value={timeOptions.timePreset}
        >
          {timePresetOptions.map(({ value, description }) => (
            <option value={value} key={value}>
              {description}
            </option>
          ))}
        </select>
      </div>
      {timeOptions.timePreset === TimePreset.CUSTOM && (
        <div className="md:flex text-gray-700">
          <DateSelect
            label="Start"
            value={timeOptions.customTimeStart}
            onChange={(newDate) =>
              setTimeOptions({ ...timeOptions, customTimeStart: newDate })
            }
          />
          <DateSelect
            label="End"
            value={timeOptions.customTimeEnd}
            onChange={(newDate) =>
              setTimeOptions({ ...timeOptions, customTimeEnd: newDate })
            }
          />
        </div>
      )}
    </div>
  );
};
