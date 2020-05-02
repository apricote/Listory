import React from "react";
import { Route, Switch } from "react-router-dom";
import { LoginFailure } from "./components/LoginFailure";
import { NavBar } from "./components/NavBar";
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
        <Route path="/login/failure" exact component={LoginFailure} />
      </Switch>
    </div>
  );
}
