import React, { Component } from "react";
import BeerCard from "../components/Beer/BeerCard";
import { Query } from "react-apollo";
import gql from "graphql-tag";

class DraftPage extends Component {
  // with a refactor we should consolidate this with the other request and provide it to both components
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

  clicked = () => {}; // don't do anyting on the draft menu

  render() {
    return (
      <div className="content-area">
        <h1>What's On Draft</h1>
        <Query query={this.beerDBQuery}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error!</p>;
            if (error) console.log(error);

            return data.beers
              .filter(beer => beer.tapped)
              .slice(0, 50) // max of 50 beers for now so we don't kill the page (would add multiple pages or lazy load with more time)
              .map(dbBeerData => (
                <BeerCard
                  beerData={dbBeerData}
                  tapped={dbBeerData.tapped}
                  showDraftButton={false}
                  clicked={this.clicked}
                  key={dbBeerData._id}
                />
              ));
          }}
        </Query>
      </div>
    );
  }
}

export default DraftPage;
