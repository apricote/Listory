import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { Listen } from "../api/entities/listen";
import { getRecentListens } from "../api/api";
import { Redirect } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const LISTENS_PER_PAGE = 15;

export const RecentListens: React.FC = () => {
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listens, setListens] = useState<Listen[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
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
    })();
  }, [user, page, totalPages]);

  if (!user) {
    return <Redirect to="/" />;
  }

  if (isLoading) {
    return (
      <div>
        <span>Loading Listens</span>
      </div>
    );
  }

  return (
    <div>
      <p>Recent listens</p>
      <div>
        {listens.length === 0 && (
          <div>
            <p>Could not find any listens!</p>
          </div>
        )}
        {listens.map((listen) => (
          <ListenItem listen={listen} />
        ))}
      </div>
      <div>
        <p>Page: {page}</p>
        {page !== 1 && (
          <p>
            <button onClick={() => setPage(page - 1)}>Previous Page</button>
          </p>
        )}
        {page !== totalPages && (
          <p>
            <button onClick={() => setPage(page + 1)}>Next Page</button>
          </p>
        )}
      </div>
    </div>
  );
};

const ListenItem: React.FC<{ listen: Listen }> = ({ listen }) => {
  const trackName = listen.track.name;
  const artists = listen.track.artists.map((artist) => artist.name).join(", ");
  const timeAgo = formatDistanceToNow(new Date(listen.playedAt), {
    addSuffix: true,
  });
  return (
    <div>
      {trackName} - {artists} - {timeAgo}
    </div>
  );
};
