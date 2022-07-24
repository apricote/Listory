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
        className="block appearance-none min-w-full md:win-w-0 md:w-1/4 bg-white dark:bg-gray-700 border border-gray-400 hover:border-gray-500 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-200 p-2 rounded shadow leading-tight focus:outline-none focus:ring"
        type="date"
        value={formatDateForDateInput(value)}
        onChange={(e) => {
          if (e.target.value === "") {
            // Firefox includes "reset" buttons in date inputs, which set the value to "",
            // is does not make sense to clear the value in our case.
            e.target.value = formatDateForDateInput(value);
            e.preventDefault();
            return;
          }
          onChange(parseDateFromDateInput(e.target.value));
        }}
      />
    </div>
  );
};
