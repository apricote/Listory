import { useMemo } from "react";
import {
  getListensReport,
  getRecentListens,
  getTopAlbums,
  getTopArtists,
  getTopTracks,
} from "../api/api";
import { ListenReportOptions } from "../api/entities/listen-report-options";
import { PaginationOptions } from "../api/entities/pagination-options";
import { TopAlbumsOptions } from "../api/entities/top-albums-options";
import { TopArtistsOptions } from "../api/entities/top-artists-options";
import { TopTracksOptions } from "../api/entities/top-tracks-options";
import { useApiClient } from "./use-api-client";
import { useAsync } from "./use-async";

const INITIAL_EMPTY_ARRAY: [] = [];
Object.freeze(INITIAL_EMPTY_ARRAY);

export const useRecentListens = (options: PaginationOptions) => {
  const { client } = useApiClient();

  const fetchData = useMemo(
    () => () => getRecentListens(options, client),
    [options, client]
  );

  const {
    value,
    pending: isLoading,
    error,
    reload,
  } = useAsync(fetchData, undefined);

  const recentListens = value ? value.items : [];
  const paginationMeta = value ? value.meta : undefined;

  return { recentListens, paginationMeta, isLoading, error, reload };
};

export const useListensReport = (options: ListenReportOptions) => {
  const { client } = useApiClient();

  const fetchData = useMemo(
    () => () => getListensReport(options, client),
    [options, client]
  );

  const {
    value: report,
    pending: isLoading,
    error,
  } = useAsync(fetchData, INITIAL_EMPTY_ARRAY);

  return { report, isLoading, error };
};

export const useTopArtists = (options: TopArtistsOptions) => {
  const { client } = useApiClient();

  const fetchData = useMemo(
    () => () => getTopArtists(options, client),
    [options, client]
  );

  const {
    value: topArtists,
    pending: isLoading,
    error,
  } = useAsync(fetchData, INITIAL_EMPTY_ARRAY);

  return { topArtists, isLoading, error };
};

export const useTopAlbums = (options: TopAlbumsOptions) => {
  const { client } = useApiClient();

  const fetchData = useMemo(
    () => () => getTopAlbums(options, client),
    [options, client]
  );

  const {
    value: topAlbums,
    pending: isLoading,
    error,
  } = useAsync(fetchData, INITIAL_EMPTY_ARRAY);

  return { topAlbums, isLoading, error };
};

export const useTopTracks = (options: TopTracksOptions) => {
  const { client } = useApiClient();

  const fetchData = useMemo(
    () => () => getTopTracks(options, client),
    [options, client]
  );

  const {
    value: topTracks,
    pending: isLoading,
    error,
  } = useAsync(fetchData, INITIAL_EMPTY_ARRAY);

  return { topTracks, isLoading, error };
};
