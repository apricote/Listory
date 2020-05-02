import React, { createContext, useContext, useEffect, useState } from "react";
import { getUsersMe, UnauthenticatedError } from "../api/api";
import { User } from "../api/entities/user";

const authContext = createContext<AuthContext>(
  (undefined as any) as AuthContext
);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().

interface AuthContext {
  user: { id: string; displayName: string } | null;
  isLoaded: boolean;
  loginWithSpotifyProps: () => { href: string };
}

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

  const loginWithSpotifyProps = () => ({ href: "/api/v1/auth/spotify" });

  useEffect(() => {
    (async () => {
      try {
        console.log("before calling getUsersMe");
        const currentUser = await getUsersMe();
        setUser(currentUser);
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          // User is not logged in
        } else {
          console.error("Error while checking login state:", err);
        }
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  return { isLoaded, user, loginWithSpotifyProps };
}
