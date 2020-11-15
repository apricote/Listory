import React from "react";

export const TopListItem: React.FC<{
  key: string;
  title: string;
  subTitle?: string;
  count: number;
}> = ({ key, title, subTitle, count }) => {
  return (
    <div
      key={key}
      className="hover:bg-gray-100 border-b border-gray-200 flex md:justify-around text-gray-700 md:px-2 py-2"
    >
      <div className="md:flex w-11/12">
        <div className={`${subTitle ? "md:w-1/2" : "md:w-full"} font-bold`}>
          {title}
        </div>
        {subTitle && <div className="md:w-1/3">{subTitle}</div>}
      </div>
      <div className="w-1/12 self-center">{count}</div>
    </div>
  );
};
