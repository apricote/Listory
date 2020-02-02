import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "./utils/history";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <header>
          <NavBar></NavBar>
        </header>
        <Switch>
          <Route path="/" exact />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
