import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ProvideApiClient } from "./hooks/use-api-client";
import { ProvideAuth } from "./hooks/use-auth";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ProvideAuth>
      <ProvideApiClient>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </ProvideApiClient>
    </ProvideAuth>
  </React.StrictMode>,
);
