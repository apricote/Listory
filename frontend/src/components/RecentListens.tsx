import { format, formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { getRecentListens } from "../api/api";
import { Listen } from "../api/entities/listen";
import { useAuth } from "../hooks/use-auth";
import { ReloadIcon } from "../icons/Reload";
import { getPaginationItems } from "../util/getPaginationItems";

const LISTENS_PER_PAGE = 15;

export const RecentListens: React.FC = () => {
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listens, setListens] = useState<Listen[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadListensForPage = async () => {
    setIsLoading(true);

    try {
      const listensFromApi = await getRecentListens({
        page,
        limit: LISTENS_PER_PAGE,
      });

      if (totalPages !== listensFromApi.meta.totalPages) {
        setTotalPages(listensFromApi.meta.totalPages);
      }
      setListens(listensFromApi.items);
    } catch (err) {
      console.error("Error while fetching recent listens:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListensForPage();
  }, [user, page, totalPages]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="lg:flex lg:justify-center p-4">
      <div className="lg:flex-shrink-0 min-w-full lg:min-w-0 lg:w-2/3 max-w-screen-lg">
        <div className="flex justify-between">
          <p className="text-2xl font-normal text-gray-700">Recent listens</p>
          <button
            className="flex-shrink-0 mx-2 bg-transparent hover:bg-green-500 text-green-500 hover:text-white font-semibold py-2 px-4 border border-green-500 hover:border-transparent rounded"
            onClick={loadListensForPage}
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
          {listens.length === 0 && (
            <div>
              <p>Could not find any listens!</p>
            </div>
          )}
          {listens.length > 0 && (
            <div className="table-auto my-2 w-full text-gray-700">
              {listens.map((listen) => (
                <ListenItem listen={listen} />
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
      {pageButtons.map((buttonPage) =>
        buttonPage ? (
          <button
            className={`${
              buttonPage === page
                ? "bg-green-300 hover:bg-green-400"
                : "bg-gray-300 hover:bg-gray-400"
            } text-gray-700 font-bold py-2 px-4`}
            onClick={() => setPage(buttonPage)}
          >
            {buttonPage}
          </button>
        ) : (
          <div className="opacity-50 cursor-default bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l">
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
    <div className="hover:bg-gray-100 border-b border-gray-200 lg:flex lg:justify-around text-gray-700 px-4 py-2">
      <div className="lg:w-1/3 font-bold">{trackName}</div>
      <div className=" lg:w-1/3">{artists}</div>
      <div
        className=" lg:w-1/6 text-gray-500 font-thin text-sm"
        title={dateTime}
      >
        {timeAgo}
      </div>
    </div>
  );
};
