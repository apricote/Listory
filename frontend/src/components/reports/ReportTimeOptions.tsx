import React from "react";
import { TimeOptions } from "../../api/entities/time-options";
import { TimePreset } from "../../api/entities/time-preset.enum";
import { DateSelect } from "../inputs/DateSelect";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
    <div className="sm:flex mb-4">
      <div className="text-gray-700 dark:text-gray-300">
        <Label className="text-sm" htmlFor={"period"}>
          Period
        </Label>
        <Select
          onValueChange={(e: TimePreset) =>
            setTimeOptions({
              ...timeOptions,
              timePreset: e,
            })
          }
          value={timeOptions.timePreset}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            {timePresetOptions.map(({ value, description }) => (
              <SelectItem value={value} key={value}>
                {description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {timeOptions.timePreset === TimePreset.CUSTOM && (
        <div className="sm:flex text-gray-700 dark:text-gray-200">
          <div className="pl-2">
            <DateSelect
              label="Start"
              value={timeOptions.customTimeStart}
              onChange={(newDate) =>
                setTimeOptions({ ...timeOptions, customTimeStart: newDate })
              }
            />
          </div>
          <div className="pl-2">
            <DateSelect
              label="End"
              value={timeOptions.customTimeEnd}
              onChange={(newDate) =>
                setTimeOptions({ ...timeOptions, customTimeEnd: newDate })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};
