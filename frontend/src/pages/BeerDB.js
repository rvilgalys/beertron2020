import React, { Component } from "react";
import BeerCard from "../components/Beer/BeerCard";
import { Query, Mutation } from "react-apollo";
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
        tapped
      }
    }
  `;

  toggleDraftMutation = gql`
    mutation ToggleDraftStatus($beerID: ID!) {
      toggleDraftStatus(toggleDraftInput: { beerID: $beerID }) {
        beerName
        tapped
      }
    }
  `;

  toggleDraftStatus = draftID => {};

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
          {({ loading, error, data, refetch }) => {
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
                ) {
                  return true;
                }
                return false;
              })
              .slice(0, 50) // max of 50 beers returned so we don't kill the page (would add multiple pages or lazy load with more time)
              .map(dbBeerData => {
                return (
                  <Mutation
                    mutation={this.toggleDraftMutation}
                    key={dbBeerData._id}
                    onCompleted={() => refetch()} // this is not ideal but it works for now
                  >
                    {(toggleDraftMutation, { loading, error }) => (
                      <BeerCard
                        beerData={dbBeerData}
                        tapped={dbBeerData.tapped}
                        showDraftButton={true}
                        clicked={id => {
                          toggleDraftMutation({
                            variables: { beerID: id }
                          });
                        }}
                      />
                    )}
                  </Mutation>
                );
              });
          }}
        </Query>
      </div>
    );
  }
}

export default BeerDBPage;
