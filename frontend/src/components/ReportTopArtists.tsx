import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { TimeOptions } from "../api/entities/time-options";
import { TimePreset } from "../api/entities/time-preset.enum";
import { useTopArtists } from "../hooks/use-api";
import { useAuth } from "../hooks/use-auth";
import { getMaxCount } from "../util/getMaxCount";
import { ReportTimeOptions } from "./ReportTimeOptions";
import { TopListItem } from "./TopListItem";

export const ReportTopArtists: React.FC = () => {
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

  const { topArtists, isLoading } = useTopArtists(options);

  const reportHasItems = !isLoading && topArtists.length !== 0;
  const maxCount = getMaxCount(topArtists);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:flex-shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700">Top Artists</p>
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
            topArtists.map(({ artist, count }) => (
              <TopListItem
                key={artist.id}
                title={artist.name}
                count={count}
                maxCount={maxCount}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
