import React from "react";
import { Route, Switch } from "react-router-dom";
import { LoginFailure } from "./components/LoginFailure";
import { LoginSuccess } from "./components/LoginSuccess";
import { NavBar } from "./components/NavBar";
import { RecentListens } from "./components/RecentListens";
import { ReportListens } from "./components/ReportListens";
import { ReportTopAlbums } from "./components/ReportTopAlbums";
import { ReportTopArtists } from "./components/ReportTopArtists";
import { ReportTopTracks } from "./components/ReportTopTracks";
import { useAuth } from "./hooks/use-auth";
import "./tailwind/generated.css";

export function App() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header>
        <NavBar />
      </header>
      <Switch>
        <Route path="/" exact />
        <Route path="/login/success" exact component={LoginSuccess} />
        <Route path="/login/failure" exact component={LoginFailure} />
        <Route path="/listens" exact component={RecentListens} />
        <Route path="/reports/listens" exact component={ReportListens} />
        <Route path="/reports/top-artists" exact component={ReportTopArtists} />
        <Route path="/reports/top-albums" exact component={ReportTopAlbums} />
        <Route path="/reports/top-tracks" exact component={ReportTopTracks} />
      </Switch>
    </div>
  );
}
