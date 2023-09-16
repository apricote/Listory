import React, { useMemo, useState } from "react";
import { TimeOptions } from "../api/entities/time-options";
import { TimePreset } from "../api/entities/time-preset.enum";
import { useTopArtists } from "../hooks/use-api";
import { useAuthProtection } from "../hooks/use-auth-protection";
import { getMaxCount } from "../util/getMaxCount";
import { ReportTimeOptions } from "./ReportTimeOptions";
import { Spinner } from "./Spinner";
import { TopListItem } from "./TopListItem";

export const ReportTopArtists: React.FC = () => {
  const { requireUser } = useAuthProtection();

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

  const { topArtists, isLoading } = useTopArtists(options);

  const reportHasItems = topArtists.length !== 0;
  const maxCount = getMaxCount(topArtists);

  requireUser();

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700 dark:text-gray-400">
            Top Artists
          </p>
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
