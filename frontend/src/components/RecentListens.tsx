import { format, formatDistanceToNow } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { Redirect } from "react-router-dom";
import { Listen } from "../api/entities/listen";
import { useRecentListens } from "../hooks/use-api";
import { useAuth } from "../hooks/use-auth";
import { ReloadIcon } from "../icons/Reload";
import { getPaginationItems } from "../util/getPaginationItems";

const LISTENS_PER_PAGE = 15;

export const RecentListens: React.FC = () => {
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const options = useMemo(() => ({ page, limit: LISTENS_PER_PAGE }), [page]);

  const { recentListens, paginationMeta, isLoading, reload } = useRecentListens(
    options
  );

  useEffect(() => {
    if (paginationMeta && totalPages !== paginationMeta.totalPages) {
      setTotalPages(paginationMeta.totalPages);
    }
  }, [totalPages, paginationMeta]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="md:flex md:justify-center p-4">
      <div className="md:flex-shrink-0 min-w-full xl:min-w-0 xl:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700">Recent listens</p>
          <button
            className="flex-shrink-0 mx-2 bg-transparent hover:bg-green-500 text-green-500 hover:text-white font-semibold py-2 px-4 border border-green-500 hover:border-transparent rounded"
            onClick={reload}
          >
            <ReloadIcon className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div>
          {isLoading && (
            <div>
              <span>Loading Listens</span>
            </div>
          )}
          {recentListens.length === 0 && (
            <div>
              <p>Could not find any listens!</p>
            </div>
          )}
          {recentListens.length > 0 && (
            <div className="table-auto my-2 w-full text-gray-700">
              {recentListens.map((listen) => (
                <ListenItem listen={listen} key={listen.id} />
              ))}
            </div>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
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
  const pageButtons = getPaginationItems(page, totalPages, 1);

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className="flex justify-center">
      <button
        className={`${
          isFirstPage ? disabledBtn : "hover:bg-gray-400"
        } bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l`}
        onClick={() => setPage(page - 1)}
        disabled={isFirstPage}
      >
        Prev
      </button>
      {pageButtons.map((buttonPage, i) =>
        buttonPage ? (
          <button
            className={`${
              buttonPage === page
                ? "bg-green-300 hover:bg-green-400"
                : "bg-gray-300 hover:bg-gray-400"
            } text-gray-700 font-bold py-2 px-4`}
            onClick={() => setPage(buttonPage)}
            key={i}
          >
            {buttonPage}
          </button>
        ) : (
          <div
            key={i}
            className="opacity-50 cursor-default bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
          >
            ...
          </div>
        )
      )}
      <button
        className={`${
          isLastPage ? disabledBtn : "hover:bg-gray-400"
        } bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r`}
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
    <div className="hover:bg-gray-100 border-b border-gray-200 md:flex md:justify-around text-gray-700 px-4 py-2">
      <div className="md:w-1/3 font-bold">{trackName}</div>
      <div className=" md:w-1/3">{artists}</div>
      <div
        className="md:w-1/6 text-gray-500 font-thin text-sm"
        title={dateTime}
      >
        {timeAgo}
      </div>
    </div>
  );
};
