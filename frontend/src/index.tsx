import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ProvideApiClient } from "./hooks/use-api-client";
import { ProvideAuth } from "./hooks/use-auth";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <ProvideAuth>
      <ProvideApiClient>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProvideApiClient>
    </ProvideAuth>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
