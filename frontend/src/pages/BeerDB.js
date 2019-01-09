import React, { Component } from "react";
import BeerCard from "../components/Beer/BeerCard";
import { Query } from "react-apollo";
import gql from "graphql-tag";

class BeerDBPage extends Component {
  state = {
    searchTerms: ""
  };

  dummyBeerData = {
    beerName: "Tasty Beer",
    breweryName: "Brewster's Brewery",
    beerStyle: "SMASH IPA",
    abv: "5.0%",
    ibu: "100"
  };

  updateSearchTerms = event => {
    const newSearch = event.target.value;
    this.setState({ searchTerms: newSearch });
  };

  beerDBQuery = gql`
    query {
      beers {
        _id
        breweryName
        beerName
        beerStyle
        abv
        ibu
      }
    }
  `;

  render() {
    return (
      <div className="content-area">
        <h1>BeerDB Page</h1>
        <input
          className="beer-search"
          value={this.state.searchTerms}
          onChange={this.updateSearchTerms}
          placeholder="Search Here"
        />
        <Query query={this.beerDBQuery}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error!</p>;
            if (error) console.log(error);

            return data.beers
              .filter(beer => {
                if (
                  beer.beerName
                    .toLowerCase()
                    .includes(this.state.searchTerms.toLowerCase()) ||
                  beer.breweryName
                    .toLowerCase()
                    .includes(this.state.searchTerms.toLowerCase()) ||
                  beer.beerStyle
                    .toLowerCase()
                    .includes(this.state.searchTerms.toLowerCase())
                )
                  return true;
                return false;
              })
              .slice(0, 50)
              .map(dbBeerData => <BeerCard beerData={dbBeerData} />);
          }}
        </Query>
      </div>
    );
  }
}

export default BeerDBPage;
