import React from "react";

export interface TopListItemProps {
  title: string;
  subTitle?: string | React.ReactNode;
  count: number;

  /**
   * Highest Number that is displayed in the top list. Used to display a "progress bar".
   */
  maxCount?: number;
}

export const TopListItem: React.FC<TopListItemProps> = ({
  title,
  subTitle,
  count,
  maxCount,
}) => {
  return (
    <div className="group bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700/25 md:justify-around text-gray-700 dark:text-gray-300 md:px-2">
      <div className="flex pt-2">
        <div className="md:flex w-11/12">
          <div className={`${subTitle ? "md:w-1/2" : "md:w-full"} font-bold`}>
            {title}
          </div>
          {subTitle && <div className="md:w-1/3">{subTitle}</div>}
        </div>
        <div className="w-1/12 self-center">{count}</div>
      </div>
      {maxCount && isMaxCountValid(maxCount) && (
        <div className="h-1 w-full bg-gradient-to-r from-teal-200/25 via-green-400 to-violet-400 dark:from-teal-700/25 dark:via-green-600/85 dark:to-amber-500 flex flex-row-reverse">
          <div
            style={{ width: numberToPercent(1 - count / maxCount) }}
            className="h-full group-hover:bg-gray-200 dark:group-hover:bg-gray-700 bg-gray-100 dark:bg-gray-800"
          ></div>
        </div>
      )}
    </div>
  );
};

const isMaxCountValid = (maxCount: number) =>
  !(Number.isNaN(maxCount) || maxCount === 0);

const numberToPercent = (ratio: number) =>
  ratio.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
  });
