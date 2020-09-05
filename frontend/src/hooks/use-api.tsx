import { useMemo, useState } from "react";
import { getListensReport, getRecentListens, getTopArtists } from "../api/api";
import { ListenReportOptions } from "../api/entities/listen-report-options";
import { PaginationOptions } from "../api/entities/pagination-options";
import { TopArtistsOptions } from "../api/entities/top-artists-options";
import { useApiClient } from "./use-api-client";
import { useAsync } from "./use-async";

const INITIAL_EMPTY_ARRAY: [] = [];
Object.freeze(INITIAL_EMPTY_ARRAY);

export const useRecentListens = (options: PaginationOptions) => {
  const { client } = useApiClient();

  const fetchData = useMemo(() => () => getRecentListens(options, client), [
    options,
    client,
  ]);

  const { value, pending: isLoading, error, reload } = useAsync(
    fetchData,
    undefined
  );

  const recentListens = value ? value.items : [];
  const paginationMeta = value ? value.meta : undefined;

  return { recentListens, paginationMeta, isLoading, error, reload };
};

export const useListensReport = (options: ListenReportOptions) => {
  const { client } = useApiClient();

  const [initialData] = useState(INITIAL_EMPTY_ARRAY);

  const fetchData = useMemo(() => () => getListensReport(options, client), [
    options,
    client,
  ]);

  const { value: report, pending: isLoading, error } = useAsync(
    fetchData,
    initialData
  );

  return { report, isLoading, error };
};

export const useTopArtists = (options: TopArtistsOptions) => {
  const { client } = useApiClient();

  const [initialData] = useState(INITIAL_EMPTY_ARRAY);

  const fetchData = useMemo(() => () => getTopArtists(options, client), [
    options,
    client,
  ]);

  const { value: topArtists, pending: isLoading, error } = useAsync(
    fetchData,
    initialData
  );

  return { topArtists, isLoading, error };
};
