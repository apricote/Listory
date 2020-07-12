import React, { useMemo, useState } from "react";
import { Redirect } from "react-router-dom";
import { getTopArtists } from "../api/api";
import { TimePreset } from "../api/entities/time-preset.enum";
import { TopArtistsOptions } from "../api/entities/top-artists-options";
import { useAsync } from "../hooks/use-async";
import { useAuth } from "../hooks/use-auth";
import { ReportTimeOptions } from "./ReportTimeOptions";
import { TimeOptions } from "../api/entities/time-options";

export const ReportTopArtists: React.FC = () => {
  const { user } = useAuth();

  const [timeOptions, setTimeOptions] = useState<TimeOptions>({
    timePreset: TimePreset.LAST_90_DAYS,
    customTimeStart: new Date(0),
    customTimeEnd: new Date(),
  });

  const fetchData = useMemo(() => () => getTopArtists({ time: timeOptions }), [
    timeOptions,
  ]);

  const { value: report, pending: isLoading } = useAsync(fetchData, []);

  const reportHasItems = !isLoading && report.length !== 0;

  if (!user) {
    return <Redirect to="/" />;
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
            report.map(({ artist, count }) => (
              <div>
                {count} - {artist.name}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
