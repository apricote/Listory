import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Album } from "../api/entities/album";
import { TimeOptions } from "../api/entities/time-options";
import { TimePreset } from "../api/entities/time-preset.enum";
import { useTopAlbums } from "../hooks/use-api";
import { useAuth } from "../hooks/use-auth";
import { getMaxCount } from "../util/getMaxCount";
import { ReportTimeOptions } from "./ReportTimeOptions";
import { TopListItem } from "./TopListItem";

export const ReportTopAlbums: React.FC = () => {
  const { user } = useAuth();

  const [timeOptions, setTimeOptions] = useState<TimeOptions>({
    timePreset: TimePreset.LAST_90_DAYS,
    customTimeStart: new Date(0),
    customTimeEnd: new Date(),
  });

  const options = useMemo(
    () => ({
      time: timeOptions,
    }),
    [timeOptions]
  );

  const { topAlbums, isLoading } = useTopAlbums(options);

  const reportHasItems = !isLoading && topAlbums.length !== 0;
  const maxCount = getMaxCount(topAlbums);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:flex-shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700">Top Albums</p>
        </div>
        <div className="shadow-xl bg-gray-100 rounded p-5 m-2">
          <ReportTimeOptions
            timeOptions={timeOptions}
            setTimeOptions={setTimeOptions}
          />
          {isLoading && (
            <div>
              <div className="loader rounded-full border-8 h-64 w-64"></div>
            </div>
          )}
          {!reportHasItems && (
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
      </div>
    </div>
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
