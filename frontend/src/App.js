import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

import AuthPage from "./pages/Auth";
import BeerDBPage from "./pages/BeerDB";
import DraftsPage from "./pages/Drafts";
import MainNav from "./components/Navigation/MainNav";

import "./App.css";

const token = localStorage.getItem("token");

const client = new ApolloClient({
  uri: `http://localhost:${process.env.PORT}/graphql`,
  request: async operation => {
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ""
      }
    });
  },
  onError: err => console.log(err)
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <React.Fragment>
            <MainNav />
            <div className="main-content">
              <Switch>
                <Redirect
                  from={`${process.env.PUBLIC_URL}/`}
                  to={`${process.env.PUBLIC_URL}/auth`}
                  exact
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/auth`}
                  component={AuthPage}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/drafts`}
                  component={DraftsPage}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/beerDB`}
                  component={BeerDBPage}
                />
              </Switch>
            </div>
          </React.Fragment>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
