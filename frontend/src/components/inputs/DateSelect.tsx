import { format, parse } from "date-fns";
import React from "react";

const parseDateFromDateInput = (input: string) =>
  parse(input, "yyyy-MM-dd", new Date());

const formatDateForDateInput = (date: Date) => format(date, "yyyy-MM-dd");

interface DateSelectProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

export const DateSelect: React.FC<DateSelectProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        className="block appearance-none min-w-full md:win-w-0 md:w-1/4 bg-white border border-gray-400 hover:border-gray-500 p-2 rounded shadow leading-tight focus:outline-none focus:ring"
        type="date"
        value={formatDateForDateInput(value)}
        onChange={(e) => onChange(parseDateFromDateInput(e.target.value))}
      />
    </div>
  );
};
