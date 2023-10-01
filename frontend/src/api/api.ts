import { AxiosInstance } from "axios";
import { formatISO, parseISO } from "date-fns";
import { ApiToken, NewApiToken } from "./entities/api-token";
import { Listen } from "./entities/listen";
import { ListenReportItem } from "./entities/listen-report-item";
import { ListenReportOptions } from "./entities/listen-report-options";
import { Pagination } from "./entities/pagination";
import { PaginationOptions } from "./entities/pagination-options";
import { TopAlbumsItem } from "./entities/top-albums-item";
import { TopAlbumsOptions } from "./entities/top-albums-options";
import { TopArtistsItem } from "./entities/top-artists-item";
import { TopArtistsOptions } from "./entities/top-artists-options";
import { TopGenresItem } from "./entities/top-genres-item";
import { TopGenresOptions } from "./entities/top-genres-options";
import { TopTracksItem } from "./entities/top-tracks-item";
import { TopTracksOptions } from "./entities/top-tracks-options";
import { SpotifyExtendedStreamingHistoryItem } from "./entities/spotify-extended-streaming-history-item";
import { ExtendedStreamingHistoryStatus } from "./entities/extended-streaming-history-status";

export class UnauthenticatedError extends Error {}

export const getRecentListens = async (
  options: PaginationOptions = { page: 1, limit: 10 },
  client: AxiosInstance,
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
  client: AxiosInstance,
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
    },
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
  client: AxiosInstance,
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
    },
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

export const getTopAlbums = async (
  options: TopAlbumsOptions,
  client: AxiosInstance,
): Promise<TopAlbumsItem[]> => {
  const {
    time: { timePreset, customTimeStart, customTimeEnd },
  } = options;

  const res = await client.get<{ items: TopAlbumsItem[] }>(
    `/api/v1/reports/top-albums`,
    {
      params: {
        timePreset,
        customTimeStart: formatISO(customTimeStart),
        customTimeEnd: formatISO(customTimeEnd),
      },
    },
  );

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to getTopAlbums: ${res.status}`);
    }
  }

  const {
    data: { items },
  } = res;
  return items;
};

export const getTopTracks = async (
  options: TopTracksOptions,
  client: AxiosInstance,
): Promise<TopTracksItem[]> => {
  const {
    time: { timePreset, customTimeStart, customTimeEnd },
  } = options;

  const res = await client.get<{ items: TopTracksItem[] }>(
    `/api/v1/reports/top-tracks`,
    {
      params: {
        timePreset,
        customTimeStart: formatISO(customTimeStart),
        customTimeEnd: formatISO(customTimeEnd),
      },
    },
  );

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to getTopTracks: ${res.status}`);
    }
  }

  const {
    data: { items },
  } = res;
  return items;
};

export const getTopGenres = async (
  options: TopGenresOptions,
  client: AxiosInstance,
): Promise<TopGenresItem[]> => {
  const {
    time: { timePreset, customTimeStart, customTimeEnd },
  } = options;

  const res = await client.get<{ items: TopGenresItem[] }>(
    `/api/v1/reports/top-Genres`,
    {
      params: {
        timePreset,
        customTimeStart: formatISO(customTimeStart),
        customTimeEnd: formatISO(customTimeEnd),
      },
    },
  );

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to getTopGenres: ${res.status}`);
    }
  }

  const {
    data: { items },
  } = res;
  return items;
};

export const getApiTokens = async (
  client: AxiosInstance,
): Promise<ApiToken[]> => {
  const res = await client.get<ApiToken[]>(`/api/v1/auth/api-tokens`);

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to getApiTokens: ${res.status}`);
    }
  }

  return res.data;
};

export const createApiToken = async (
  description: string,
  client: AxiosInstance,
): Promise<NewApiToken> => {
  const res = await client.post<NewApiToken>(`/api/v1/auth/api-tokens`, {
    description,
  });

  switch (res.status) {
    case 201: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to createApiToken: ${res.status}`);
    }
  }

  return res.data;
};

export const revokeApiToken = async (
  id: string,
  client: AxiosInstance,
): Promise<void> => {
  const res = await client.delete(`/api/v1/auth/api-tokens/${id}`);

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to revokeApiToken: ${res.status}`);
    }
  }
};

export const importExtendedStreamingHistory = async (
  listens: SpotifyExtendedStreamingHistoryItem[],
  client: AxiosInstance
): Promise<void> => {
  const res = await client.post(`/api/v1/import/extended-streaming-history`, {
    listens,
  });

  switch (res.status) {
    case 201: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(
        `Unable to importExtendedStreamingHistory: ${res.status}`
      );
    }
  }
};

export const getExtendedStreamingHistoryStatus = async (
  client: AxiosInstance
): Promise<ExtendedStreamingHistoryStatus> => {
  const res = await client.get<ExtendedStreamingHistoryStatus>(
    `/api/v1/import/extended-streaming-history/status`
  );

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(
        `Unable to getExtendedStreamingHistoryStatus: ${res.status}`
      );
    }
  }

  return res.data;
};
