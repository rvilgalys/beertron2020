import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BeerDBPage from "./pages/BeerDB";
import DraftsPage from "./pages/Drafts";
import MainNav from "./components/Navigation/MainNav";

import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNav />
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/drafts" component={DraftsPage} />
            <Route path="/beerDB" component={BeerDBPage} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
