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
    <div className="group hover:bg-gray-200 bg-gray-100 border-b border-gray-200 md:justify-around text-gray-700 md:px-2">
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
        <div className="h-1 w-full bg-gradient-to-r from-teal-200 via-green-400 to-violet-400 flex flex-row-reverse">
          <div
            style={{ width: numberToPercent(1 - count / maxCount) }}
            className="h-full group-hover:bg-gray-200 bg-gray-100"
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
