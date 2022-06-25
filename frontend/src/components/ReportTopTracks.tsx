import React, { useMemo, useState } from "react";
import { TimeOptions } from "../api/entities/time-options";
import { TimePreset } from "../api/entities/time-preset.enum";
import { Track } from "../api/entities/track";
import { useTopTracks } from "../hooks/use-api";
import { useAuthProtection } from "../hooks/use-auth-protection";
import { getMaxCount } from "../util/getMaxCount";
import { ReportTimeOptions } from "./ReportTimeOptions";
import { TopListItem } from "./TopListItem";

export const ReportTopTracks: React.FC = () => {
  const { requireUser } = useAuthProtection();

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

  const { topTracks, isLoading } = useTopTracks(options);

  const reportHasItems = !isLoading && topTracks.length !== 0;

  requireUser();

  const maxCount = getMaxCount(topTracks);

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700">Top Tracks</p>
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
            topTracks.map(({ track, count }) => (
              <ReportItem track={track} count={count} maxCount={maxCount} />
            ))}
        </div>
      </div>
    </div>
  );
};

const ReportItem: React.FC<{
  track: Track;
  count: number;
  maxCount: number;
}> = ({ track, count, maxCount }) => {
  const artists = track.artists?.map((artist) => artist.name).join(", ") || "";

  return (
    <TopListItem
      key={track.id}
      title={track.name}
      subTitle={artists}
      count={count}
      maxCount={maxCount}
    />
  );
};
