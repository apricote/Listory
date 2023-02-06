import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthApiTokens } from "./components/AuthApiTokens";
import { Footer } from "./components/Footer";
import { ImportListens } from "./components/ImportListens";
import { LoginFailure } from "./components/LoginFailure";
import { LoginLoading } from "./components/LoginLoading";
import { NavBar } from "./components/NavBar";
import { Navigate } from "react-router-dom";
import { RecentListens } from "./components/reports/RecentListens";
import { ReportListens } from "./components/reports/ReportListens";
import { ReportTopAlbums } from "./components/reports/ReportTopAlbums";
import { ReportTopArtists } from "./components/reports/ReportTopArtists";
import { ReportTopGenres } from "./components/reports/ReportTopGenres";
import { ReportTopTracks } from "./components/reports/ReportTopTracks";
import { useAuth } from "./hooks/use-auth";

export function App() {
  const { isLoaded, user } = useAuth();

  if (!isLoaded) {
    return <LoginLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen justify-between dark:bg-gray-900">
      <header>
        <NavBar />
      </header>
      <main className="mb-auto" /* mb-auto is for sticky footer */>
        <div className="md:flex md:justify-center p-4 text-gray-700 dark:text-gray-400">
          <div className="md:shrink-0 min-w-full xl:min-w-0 xl:w-2/3 lg:max-w-screen-lg">
            {user && (
              <Routes>
                <Route index element={<Navigate to="/listens" />} />
                <Route path="/login/success" element={<Navigate to="/" />} />
                <Route path="/login/failure" element={<LoginFailure />} />
                <Route path="/listens" element={<RecentListens />} />
                <Route path="/reports/listens" element={<ReportListens />} />
                <Route
                  path="/reports/top-artists"
                  element={<ReportTopArtists />}
                />
                <Route
                  path="/reports/top-albums"
                  element={<ReportTopAlbums />}
                />
                <Route
                  path="/reports/top-tracks"
                  element={<ReportTopTracks />}
                />
                <Route
                  path="/reports/top-genres"
                  element={<ReportTopGenres />}
                />
                <Route path="/auth/api-tokens" element={<AuthApiTokens />} />
                <Route path="/import" element={<ImportListens />} />
              </Routes>
            )}
            {!user && (
              <Routes>
                <Route index />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            )}
          </div>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
