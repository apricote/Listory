import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../api/entities/user";
import { useAuth } from "../hooks/use-auth";
import { useOutsideClick } from "../hooks/use-outside-click";
import { CogwheelIcon } from "../icons/Cogwheel";
import { SpotifyLogo } from "../icons/Spotify";

export const NavBar: React.FC = () => {
  const { user, loginWithSpotifyProps } = useAuth();

  return (
    <div className="flex items-center justify-between flex-wrap bg-green-500 dark:bg-gray-800 p-6">
      <div className="flex items-center shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">Listory</span>
      </div>
      <nav className="w-full block grow lg:flex lg:items-center lg:w-auto ">
        <div className="text-sm lg:grow">
          {user && (
            <>
              <Link to="/">
                <NavItem>Home</NavItem>
              </Link>
              <Link to="/listens">
                <NavItem>Your Listens</NavItem>
              </Link>
              <Link to="/reports/listens">
                <NavItem>Listens Report</NavItem>
              </Link>
              <Link to="/reports/top-artists">
                <NavItem>Top Artists</NavItem>
              </Link>
              <Link to="/reports/top-albums">
                <NavItem>Top Albums</NavItem>
              </Link>
              <Link to="/reports/top-tracks">
                <NavItem>Top Tracks</NavItem>
              </Link>
              <Link to="/reports/top-genres">
                <NavItem>Top Genres</NavItem>
              </Link>
            </>
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
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="block mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white mr-4">
      {children}
    </span>
  );
};

const NavUserInfo: React.FC<{ user: User }> = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const closeMenu = useCallback(() => setMenuOpen(false), [setMenuOpen]);

  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, closeMenu);

  return (
    <div ref={wrapperRef}>
      <div
        className="flex items-center mr-4 mt-4 lg:mt-0 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="text-green-200 text-sm">{user.displayName}</span>
        {user.photo && (
          <img
            className="w-6 h-6 rounded-full ml-4"
            src={user.photo}
            alt="Profile of logged in user"
          ></img>
        )}
      </div>
      {menuOpen ? <NavUserInfoMenu closeMenu={closeMenu} /> : null}
    </div>
  );
};

const NavUserInfoMenu: React.FC<{ closeMenu: () => void }> = ({
  closeMenu,
}) => {
  return (
    <div className="relative">
      <div className="drop-down w-48 overflow-hidden bg-green-100 dark:bg-gray-700 text-gray-700 dark:text-green-200 rounded-md shadow absolute top-3 right-3">
        <ul>
          <li className="px-3 py-3 text-sm font-medium flex items-center space-x-2 hover:bg-green-200 hover:text-gray-800 dark:hover:text-white">
            <span>
              <CogwheelIcon className="w-5 h-5 fill-current" />
            </span>
            <Link to="/auth/api-tokens" onClick={closeMenu}>
              API Tokens
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
