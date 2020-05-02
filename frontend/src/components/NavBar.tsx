import React from "react";
import { Link } from "react-router-dom";
import { User } from "../api/user";
import { useAuth } from "../hooks/use-auth";
import { SpotifyLogo } from "../icons/Spotify";

export const NavBar: React.FC = () => {
  const { user, loginWithSpotifyProps } = useAuth();

  return (
    <nav className="flex items-center justify-between flex-wrap bg-green-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">Listory</span>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {user && (
            <Link to="/">
              <NavItem>Home</NavItem>
            </Link>
          )}
        </div>
        <div>
          {!user && (
            <a {...loginWithSpotifyProps()}>
              <NavItem>
                Login with Spotify{" "}
                <SpotifyLogo className="w-6 h-6 ml-2 mb-1 inline fill-current text-white" />
              </NavItem>
            </a>
          )}
          {user && <NavUserInfo user={user} />}
        </div>
      </div>
    </nav>
  );
};

const NavUserInfo: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex items-center mr-4">
      <span className="text-green-200 text-sm">{user.displayName}</span>
      {user.photo && (
        <img className="w-6 h-6 rounded-full ml-4" src={user.photo}></img>
      )}
    </div>
  );
};

const NavItem: React.FC = ({ children }) => {
  return (
    <span className="block mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white mr-4">
      {children}
    </span>
  );
};
