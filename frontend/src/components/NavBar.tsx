import React from "react";
import { Link } from "react-router-dom";
import { User } from "../api/entities/user";
import { useAuth } from "../hooks/use-auth";
import { CogwheelIcon } from "../icons/Cogwheel";
import { SpotifyLogo } from "../icons/Spotify";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export const NavBar: React.FC = () => {
  const { user, loginWithSpotifyProps } = useAuth();

  return (
    <div className="flex items-center justify-between flex-wrap py-3 px-6 bg-green-500 dark:bg-gray-800 dark:text-gray-100">
      <div className="flex items-center shrink-0 mr-6">
        <span className="font-semibold text-xl tracking-tight text-white">
          Listory
        </span>
      </div>
      <nav className="w-full grow sm:flex sm:items-center sm:w-auto">
        <div className="sm:grow">
          {user && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/listens">Your Listens</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 grid-flow-row grid-cols-1 sm:grid-cols-2 w-6 min-w-max sm:min-w-fit sm:w-[500px]">
                      <NavListItem title="Listens" to={"/reports/listens"}>
                        When did you listen how much music?
                      </NavListItem>

                      <NavListItem
                        title="Top Artists"
                        to={"/reports/top-artists"}
                      >
                        What are your top artists in the last week/month/year?
                      </NavListItem>

                      <NavListItem
                        title="Top Albums"
                        to={"/reports/top-albums"}
                      >
                        What are your top albums in the last week/month/year?
                      </NavListItem>

                      <NavListItem
                        title="Top Tracks"
                        to={"/reports/top-tracks"}
                      >
                        What are your top tracks in the last week/month/year?
                      </NavListItem>

                      <NavListItem
                        title="Top Genres"
                        to={"/reports/top-genres"}
                      >
                        What are your top genres in the last week/month/year?
                      </NavListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        <div>
          {!user && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <a {...loginWithSpotifyProps()}>
                      <span>Login with Spotify </span>
                      <SpotifyLogo className="w-6 h-6 ml-2 mb-1 inline fill-current text-white" />
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          {user && <NavUserInfo user={user} />}
        </div>
      </nav>
    </div>
  );
};

const NavListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-3 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
NavListItem.displayName = "NavListItem";

const NavUserInfo: React.FC<{ user: User }> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex flex-row-reverse sm:flex-row px-0 mt-2 sm:px-8"
        >
          <span className="text-green-200 pl-2 sm:pr-2">
            {user.displayName}
          </span>
          <Avatar>
            <AvatarImage
              src={user.photo}
              alt="Profile picture of logged in user"
            />
            <AvatarFallback>
              {user.displayName
                .split(" ")
                .filter((name) => name.length > 0)
                .map((name) => name[0].toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/auth/api-tokens">
              <CogwheelIcon className="w-5 h-5 fill-current pr-2" />
              API Tokens
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
