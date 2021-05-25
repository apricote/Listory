import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUsersMe, postAuthTokenRefresh } from "../api/auth-api";
import { User } from "../api/entities/user";

interface AuthContext {
  isLoaded: boolean;
  user: User | null;
  accessToken: string;
  error: Error | null;
  refreshAccessToken: () => Promise<string>;
  loginWithSpotifyProps: () => { href: string };
}

const authContext = createContext<AuthContext>(undefined as any as AuthContext);

export const ProvideAuth: React.FC = ({ children }) => {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth(): AuthContext {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

  const loginWithSpotifyProps = () => ({ href: "/api/v1/auth/spotify" });

  const refreshAccessToken = useCallback(async () => {
    try {
      const { accessToken: newAccessToken } = await postAuthTokenRefresh();
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (err) {
      setAccessToken("");
      setUser(null);
      setIsLoaded(true);
      setError(err);

      throw err;
    }
  }, []);

  useEffect(() => {
    refreshAccessToken().catch(() => {
      console.log("Unable to refresh access token");
    });
  }, [refreshAccessToken]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    async function getUser(token: string) {
      const newUser = await getUsersMe(token);
      setUser(newUser);
      setIsLoaded(true);
    }

    getUser(accessToken);
  }, [accessToken]);

  return {
    isLoaded,
    user,
    accessToken,
    error,
    refreshAccessToken,
    loginWithSpotifyProps,
  };
}
