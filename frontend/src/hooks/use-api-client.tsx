import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./use-auth";

interface ApiClientContext {
  client: AxiosInstance;
}

const apiClientContext = createContext<ApiClientContext>(
  undefined as any as ApiClientContext,
);

export const ProvideApiClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useProvideApiClient();

  return (
    <apiClientContext.Provider value={auth}>
      {children}
    </apiClientContext.Provider>
  );
};

export function useApiClient() {
  return useContext(apiClientContext);
}

function useProvideApiClient(): ApiClientContext {
  const { accessToken, refreshAccessToken } = useAuth();

  // Wrap value to immediately update when refreshing access token
  // and always having access to newest access token in interceptor
  const localAccessToken = useRef(accessToken);

  // initialState must be passed as function as return value of axios.create()
  // is also callable and react will call it and then use that result (promise)
  // as the initial state instead of the axios instance.
  const [client] = useState<AxiosInstance>(() => axios.create());

  useEffect(() => {
    localAccessToken.current = accessToken;
  }, [localAccessToken, accessToken]);

  // TODO Implement lock to avoid multiple parallel refreshes, maybe in useAuth?

  useEffect(() => {
    // Setup Axios Interceptors
    const requestInterceptor = client.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${localAccessToken.current}`;

        return config;
      },
      (err) => Promise.reject(err),
    );
    const responseInterceptor = client.interceptors.response.use(
      (data) => data,
      async (err: any) => {
        if (!err.response || !err.config) {
          throw err;
        }

        const { response, config } = err as {
          response: AxiosResponse;
          config: InternalAxiosRequestConfig;
        };

        if (response && response.status !== 401) {
          throw err;
        }

        // TODO error handling
        localAccessToken.current = await refreshAccessToken();

        return client.request(config);
      },
    );

    return () => {
      client.interceptors.request.eject(requestInterceptor);
      client.interceptors.response.eject(responseInterceptor);
    };
  }, [client, localAccessToken, refreshAccessToken]);

  return { client };
}
