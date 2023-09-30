import React, { useMemo, useState } from "react";
import { Album } from "../../api/entities/album";
import { TimeOptions } from "../../api/entities/time-options";
import { TimePreset } from "../../api/entities/time-preset.enum";
import { useTopAlbums } from "../../hooks/use-api";
import { getMaxCount } from "../../util/getMaxCount";
import { ReportTimeOptions } from "./ReportTimeOptions";
import { Spinner } from "../ui/Spinner";
import { TopListItem } from "./TopListItem";

export const ReportTopAlbums: React.FC = () => {
  const [timeOptions, setTimeOptions] = useState<TimeOptions>({
    timePreset: TimePreset.LAST_90_DAYS,
    customTimeStart: new Date("2020"),
    customTimeEnd: new Date(),
  });

  const options = useMemo(
    () => ({
      time: timeOptions,
    }),
    [timeOptions],
  );

  const { topAlbums, isLoading } = useTopAlbums(options);

  const reportHasItems = topAlbums.length !== 0;
  const maxCount = getMaxCount(topAlbums);

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-2xl font-normal text-gray-700 dark:text-gray-400">
          Top Albums
        </h2>
      </div>
      <div className="shadow-xl bg-gray-100 dark:bg-gray-800 rounded p-5 m-2">
        <ReportTimeOptions
          timeOptions={timeOptions}
          setTimeOptions={setTimeOptions}
        />
        {isLoading && <Spinner className="m-8" />}
        {!reportHasItems && !isLoading && (
          <div>
            <p>Report is emtpy! :(</p>
          </div>
        )}
        {reportHasItems &&
          topAlbums.map(({ album, count }) => (
            <ReportItem
              key={album.id}
              album={album}
              count={count}
              maxCount={maxCount}
            />
          ))}
      </div>
    </>
  );
};

const ReportItem: React.FC<{
  album: Album;
  count: number;
  maxCount: number;
}> = ({ album, count, maxCount }) => {
  const artists = album.artists?.map((artist) => artist.name).join(", ") || "";

  return (
    <TopListItem
      key={album.id}
      title={album.name}
      subTitle={artists}
      count={count}
      maxCount={maxCount}
    />
  );
};
