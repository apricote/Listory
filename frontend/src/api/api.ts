import { AxiosInstance } from "axios";
import { formatISO, parseISO } from "date-fns";
import { Listen } from "./entities/listen";
import { ListenReportItem } from "./entities/listen-report-item";
import { ListenReportOptions } from "./entities/listen-report-options";
import { Pagination } from "./entities/pagination";
import { PaginationOptions } from "./entities/pagination-options";
import { TopArtistsItem } from "./entities/top-artists-item";
import { TopArtistsOptions } from "./entities/top-artists-options";

export class UnauthenticatedError extends Error {}

export const getRecentListens = async (
  options: PaginationOptions = { page: 1, limit: 10 },
  client: AxiosInstance
): Promise<Pagination<Listen>> => {
  const { page, limit } = options;

  const res = await client.get<Pagination<Listen>>(`/api/v1/listens`, {
    params: { page, limit },
  });

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to getRecentListens: ${res.status}`);
    }
  }

  return res.data;
};

export const getListensReport = async (
  options: ListenReportOptions,
  client: AxiosInstance
): Promise<ListenReportItem[]> => {
  const {
    timeFrame,
    time: { timePreset, customTimeStart, customTimeEnd },
  } = options;

  const res = await client.get<{ items: { count: number; date: string }[] }>(
    `/api/v1/reports/listens`,
    {
      params: {
        timeFrame,
        timePreset,
        customTimeStart: formatISO(customTimeStart),
        customTimeEnd: formatISO(customTimeEnd),
      },
    }
  );

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to getListensReport: ${res.status}`);
    }
  }

  const {
    data: { items: rawItems },
  } = res;
  return rawItems.map(({ count, date }) => ({ count, date: parseISO(date) }));
};

export const getTopArtists = async (
  options: TopArtistsOptions,
  client: AxiosInstance
): Promise<TopArtistsItem[]> => {
  const {
    time: { timePreset, customTimeStart, customTimeEnd },
  } = options;

  const res = await client.get<{ items: TopArtistsItem[] }>(
    `/api/v1/reports/top-artists`,
    {
      params: {
        timePreset,
        customTimeStart: formatISO(customTimeStart),
        customTimeEnd: formatISO(customTimeEnd),
      },
    }
  );

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to getTopArtists: ${res.status}`);
    }
  }

  const {
    data: { items },
  } = res;
  return items;
};
