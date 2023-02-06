import { useCallback, useMemo } from "react";
import {
  createApiToken,
  getApiTokens,
  getExtendedStreamingHistoryStatus,
  getListensReport,
  getRecentListens,
  getTopAlbums,
  getTopArtists,
  getTopGenres,
  getTopTracks,
  importExtendedStreamingHistory,
  revokeApiToken,
} from "../api/api";
import { ListenReportOptions } from "../api/entities/listen-report-options";
import { PaginationOptions } from "../api/entities/pagination-options";
import { TopAlbumsOptions } from "../api/entities/top-albums-options";
import { TopArtistsOptions } from "../api/entities/top-artists-options";
import { TopGenresOptions } from "../api/entities/top-genres-options";
import { TopTracksOptions } from "../api/entities/top-tracks-options";
import { useApiClient } from "./use-api-client";
import { useAsync } from "./use-async";
import { SpotifyExtendedStreamingHistoryItem } from "../api/entities/spotify-extended-streaming-history-item";

const INITIAL_EMPTY_ARRAY: [] = [];
Object.freeze(INITIAL_EMPTY_ARRAY);

export const useRecentListens = (options: PaginationOptions) => {
  const { client } = useApiClient();

  const fetchData = useMemo(
    () => () => getRecentListens(options, client),
    [options, client],
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
    [options, client],
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
    [options, client],
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
    [options, client],
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
    [options, client],
  );

  const {
    value: topTracks,
    pending: isLoading,
    error,
  } = useAsync(fetchData, INITIAL_EMPTY_ARRAY);

  return { topTracks, isLoading, error };
};

export const useTopGenres = (options: TopGenresOptions) => {
  const { client } = useApiClient();

  const fetchData = useMemo(
    () => () => getTopGenres(options, client),
    [options, client],
  );

  const {
    value: topGenres,
    pending: isLoading,
    error,
  } = useAsync(fetchData, INITIAL_EMPTY_ARRAY);

  return { topGenres, isLoading, error };
};

export const useApiTokens = () => {
  const { client } = useApiClient();

  const fetchData = useMemo(() => () => getApiTokens(client), [client]);

  const {
    value: apiTokens,
    pending: isLoading,
    error,
    reload,
  } = useAsync(fetchData, INITIAL_EMPTY_ARRAY);

  const createToken = useCallback(
    async (description: string) => {
      const apiToken = await createApiToken(description, client);
      await reload();

      return apiToken;
    },
    [client, reload],
  );

  const revokeToken = useCallback(
    async (id: string) => {
      await revokeApiToken(id, client);
      await reload();
    },
    [client, reload],
  );

  return { apiTokens, isLoading, error, createToken, revokeToken };
};

export const useSpotifyImportExtendedStreamingHistory = () => {
  const { client } = useApiClient();

  const importHistory = useCallback(
    async (listens: SpotifyExtendedStreamingHistoryItem[]) => {
      return importExtendedStreamingHistory(listens, client);
    },
    [client]
  );

  const getStatus = useCallback(async () => {
    return getExtendedStreamingHistoryStatus(client);
  }, [client]);

  return { importHistory, getStatus };
};

export const useSpotifyImportExtendedStreamingHistoryStatus = () => {
  const { client } = useApiClient();

  const fetchData = useMemo(
    () => () => getExtendedStreamingHistoryStatus(client),
    [client]
  );

  const {
    value: importStatus,
    pending: isLoading,
    error,
    reload,
  } = useAsync(fetchData, { total: 0, imported: 0 });

  return { importStatus, isLoading, error, reload };
};
