import { User } from "./user";

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
