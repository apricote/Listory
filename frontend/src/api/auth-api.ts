/*
 * These calls are seperate from the others because they are only
 * used in the useAuth hook which is used before the useApiClient hook.
 *
 * They do not use the apiClient/axios.
 */

import { UnauthenticatedError } from "./api";
import { RefreshTokenResponse } from "./entities/refresh-token-response";
import { User } from "./entities/user";

export const getUsersMe = async (accessToken: string): Promise<User> => {
  const res = await fetch(`/api/v1/users/me`, {
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

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

export const postAuthTokenRefresh = async (): Promise<RefreshTokenResponse> => {
  const res = await fetch(`/api/v1/auth/token/refresh`, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  switch (res.status) {
    case 201: {
      break;
    }
    case 401: {
      throw new UnauthenticatedError(`No Refresh Token or token expired`);
    }
    default: {
      throw new Error(`Unable to postAuthTokenRefresh: ${res.status}`);
    }
  }

  const refreshTokenResponse: RefreshTokenResponse = await res.json();
  return refreshTokenResponse;
};
