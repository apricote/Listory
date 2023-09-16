import { format, formatDistanceToNow } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { Listen } from "../api/entities/listen";
import { useRecentListens } from "../hooks/use-api";
import { useAuthProtection } from "../hooks/use-auth-protection";
import { ReloadIcon } from "../icons/Reload";
import { getPaginationItems } from "../util/getPaginationItems";
import { Spinner } from "./Spinner";

const LISTENS_PER_PAGE = 15;

export const RecentListens: React.FC = () => {
  const { requireUser } = useAuthProtection();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const options = useMemo(() => ({ page, limit: LISTENS_PER_PAGE }), [page]);

  const { recentListens, paginationMeta, isLoading, reload } =
    useRecentListens(options);

  useEffect(() => {
    if (paginationMeta && totalPages !== paginationMeta.totalPages) {
      setTotalPages(paginationMeta.totalPages);
    }
  }, [totalPages, paginationMeta]);

  requireUser();

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700 dark:text-gray-400">
            Recent listens
          </p>
          <button
            className="shrink-0 mx-2 bg-transparent hover:bg-green-500 text-green-500 hover:text-white font-semibold py-2 px-4 border border-green-500 hover:border-transparent rounded"
            onClick={reload}
          >
            <ReloadIcon className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div className="shadow-xl bg-gray-100 dark:bg-gray-800 rounded p-2 m-2">
          {isLoading && <Spinner className="m-8" />}
          {recentListens.length === 0 && (
            <div className="text-center m-4">
              <p className="text-gray-700 dark:text-gray-400">
                Could not find any listens!
              </p>
            </div>
          )}
          <div>
            {recentListens.length > 0 && (
              <div className="table-auto w-full">
                {recentListens.map((listen) => (
                  <ListenItem listen={listen} key={listen.id} />
                ))}
              </div>
            )}
          </div>
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>
    </div>
  );
};

const Pagination: React.FC<{
  page: number;
  totalPages: number;
  setPage: (newPage: number) => void;
}> = ({ page, totalPages, setPage }) => {
  const disabledBtn = "opacity-50 cursor-default";
  const hoverBtn = "hover:bg-gray-400 dark:hover:bg-gray-600";
  const defaultBtn =
    "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-4";
  const pageButtons = getPaginationItems(page, totalPages, 1);

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className="flex justify-center my-4">
      <button
        className={`${
          isFirstPage ? disabledBtn : hoverBtn
        } ${defaultBtn} rounded-l`}
        onClick={() => setPage(page - 1)}
        disabled={isFirstPage}
      >
        Prev
      </button>
      {pageButtons.map((buttonPage, i) =>
        buttonPage ? (
          <button
            className={`${hoverBtn} ${defaultBtn} ${
              buttonPage === page &&
              "bg-green-400 dark:bg-green-500 hover:bg-green-400 dark:hover:bg-green-500 cursor-default"
            }`}
            onClick={() => setPage(buttonPage)}
            key={i}
          >
            {buttonPage}
          </button>
        ) : (
          <div
            key={i}
            className={`cursor-default ${disabledBtn} ${defaultBtn}`}
          >
            ...
          </div>
        ),
      )}
      <button
        className={`${
          isLastPage ? disabledBtn : hoverBtn
        } ${defaultBtn} rounded-r`}
        onClick={() => setPage(page + 1)}
        disabled={isLastPage}
      >
        Next
      </button>
    </div>
  );
};

const ListenItem: React.FC<{ listen: Listen }> = ({ listen }) => {
  const trackName = listen.track.name;
  const artists = listen.track.artists.map((artist) => artist.name).join(", ");
  const timeAgo = formatDistanceToNow(new Date(listen.playedAt), {
    addSuffix: true,
  });
  const dateTime = format(new Date(listen.playedAt), "PP p");
  return (
    <div className="hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700/25 md:flex md:justify-around text-gray-700 dark:text-gray-300 px-2 py-2">
      <div className="md:w-1/2 font-bold">{trackName}</div>
      <div className=" md:w-1/3">{artists}</div>
      <div
        className="md:w-1/6 text-gray-500 font-extra-light text-sm"
        title={dateTime}
      >
        {timeAgo}
      </div>
    </div>
  );
};
