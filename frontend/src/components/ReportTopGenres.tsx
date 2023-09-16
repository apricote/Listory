import React, { useMemo, useState } from "react";
import { Artist } from "../api/entities/artist";
import { Genre } from "../api/entities/genre";
import { TimeOptions } from "../api/entities/time-options";
import { TimePreset } from "../api/entities/time-preset.enum";
import { TopArtistsItem } from "../api/entities/top-artists-item";
import { useTopGenres } from "../hooks/use-api";
import { useAuthProtection } from "../hooks/use-auth-protection";
import { capitalizeString } from "../util/capitalizeString";
import { getMaxCount } from "../util/getMaxCount";
import { ReportTimeOptions } from "./ReportTimeOptions";
import { Spinner } from "./Spinner";
import { TopListItem } from "./TopListItem";

export const ReportTopGenres: React.FC = () => {
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

  const { topGenres, isLoading } = useTopGenres(options);

  const reportHasItems = topGenres.length !== 0;

  requireUser();

  const maxCount = getMaxCount(topGenres);

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700 dark:text-gray-400">
            Top Genres
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
            topGenres.map(({ genre, artists, count }) => (
              <ReportItem
                key={genre.id}
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
      <ArtistItem key={artist.id} artist={artist} count={artistCount} />
    ))
    // @ts-expect-error
    .reduce((acc, curr) => (acc === null ? [curr] : [acc, ", ", curr]), null);

  return (
    <TopListItem
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
