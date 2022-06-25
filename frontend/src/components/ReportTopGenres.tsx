import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Artist } from "../api/entities/artist";
import { Genre } from "../api/entities/genre";
import { TimeOptions } from "../api/entities/time-options";
import { TimePreset } from "../api/entities/time-preset.enum";
import { TopArtistsItem } from "../api/entities/top-artists-item";
import { useTopGenres } from "../hooks/use-api";
import { useAuth } from "../hooks/use-auth";
import { capitalizeString } from "../util/capitalizeString";
import { getMaxCount } from "../util/getMaxCount";
import { ReportTimeOptions } from "./ReportTimeOptions";
import { TopListItem } from "./TopListItem";

export const ReportTopGenres: React.FC = () => {
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

  const { topGenres, isLoading } = useTopGenres(options);

  const reportHasItems = !isLoading && topGenres.length !== 0;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const maxCount = getMaxCount(topGenres);

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700">Top Genres</p>
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
            topGenres.map(({ genre, artists, count }) => (
              <ReportItem
                genre={genre}
                count={count}
                artists={artists}
                maxCount={maxCount}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const ReportItem: React.FC<{
  genre: Genre;
  artists: TopArtistsItem[];
  count: number;
  maxCount: number;
}> = ({ genre, artists, count, maxCount }) => {
  const artistList = artists
    .map(({ artist, count: artistCount }) => (
      <ArtistItem artist={artist} count={artistCount} />
    ))
    // @ts-expect-error
    .reduce((acc, curr) => (acc === null ? [curr] : [acc, ", ", curr]), null);

  return (
    <TopListItem
      key={genre.id}
      title={capitalizeString(genre.name)}
      subTitle={artistList}
      count={count}
      maxCount={maxCount}
    />
  );
};

const ArtistItem: React.FC<{
  artist: Artist;
  count: number;
}> = ({ artist, count }) => (
  <span title={`Listens: ${count}`}>{artist.name}</span>
);
