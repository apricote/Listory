import { formatISO, parseISO } from "date-fns";
import { qs } from "../util/queryString";
import { Listen } from "./entities/listen";
import { ListenReportItem } from "./entities/listen-report-item";
import { ListenReportOptions } from "./entities/listen-report-options";
import { Pagination } from "./entities/pagination";
import { PaginationOptions } from "./entities/pagination-options";
import { TopArtistsItem } from "./entities/top-artists-item";
import { TopArtistsOptions } from "./entities/top-artists-options";
import { User } from "./entities/user";

export class UnauthenticatedError extends Error {}

const getToken = (): string => {
  const cookieValue = document.cookie.replace(
    /(?:(?:^|.*;\s*)listory_access_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  return cookieValue;
};

const getDefaultHeaders = (): Headers => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${getToken()}`);

  return headers;
};

export const getUsersMe = async (): Promise<User> => {
  const res = await fetch(`/api/v1/users/me`, { headers: getDefaultHeaders() });

  switch (res.status) {
    case 200: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No token or token expired`);
    }
    default: {
      throw new Error(`Unable to getUsersMe: ${res.status}`);
    }
  }

  const user: User = await res.json();
  return user;
};

export const getRecentListens = async (
  options: PaginationOptions = { page: 1, limit: 10 }
): Promise<Pagination<Listen>> => {
  const { page, limit } = options;

  const res = await fetch(
    `/api/v1/listens?${qs({ page: page.toString(), limit: limit.toString() })}`,
    {
      headers: getDefaultHeaders(),
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
      throw new Error(`Unable to getRecentListens: ${res.status}`);
    }
  }

  const listens: Pagination<Listen> = await res.json();
  return listens;
};

export const getListensReport = async (
  options: ListenReportOptions
): Promise<ListenReportItem[]> => {
  const { timeFrame, timeStart, timeEnd } = options;

  const res = await fetch(
    `/api/v1/reports/listens?${qs({
      timeFrame,
      timeStart: formatISO(timeStart),
      timeEnd: formatISO(timeEnd),
    })}`,
    {
      headers: getDefaultHeaders(),
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

  const rawItems: { count: number; date: string }[] = (await res.json()).items;
  return rawItems.map(({ count, date }) => ({ count, date: parseISO(date) }));
};

export const getTopArtists = async (
  options: TopArtistsOptions
): Promise<TopArtistsItem[]> => {
  const { timePreset, customTimeStart, customTimeEnd } = options;

  const res = await fetch(
    `/api/v1/reports/top-artists?${qs({
      timePreset,
      customTimeStart: formatISO(customTimeStart),
      customTimeEnd: formatISO(customTimeEnd),
    })}`,
    {
      headers: getDefaultHeaders(),
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

  const items: TopArtistsItem[] = (await res.json()).items;
  return items;
};
