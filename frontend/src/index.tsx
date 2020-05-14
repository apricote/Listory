import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ProvideAuth } from "./hooks/use-auth";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <ProvideAuth>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProvideAuth>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
