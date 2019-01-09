import React from "react";

import "./BeerCard.css";

const BeerCard = props => {
  let draftButtonClasses = "beer-draft-button";
  let draftButtonLabel = "🍺 Put on Draft 🍺";

  if (props.beerData.drafted) {
    draftButtonClasses += " on-draft";
    draftButtonLabel = "🍺 On Draft 🍺";
  }

  return (
    <div className="beer-card">
      <h3>
        <span className="beer-name">{props.beerData.beerName}</span>
      </h3>
      <button className={draftButtonClasses}>{draftButtonLabel}</button>

      <span className="brewery-name">{props.beerData.breweryName}</span>
      <span className="beer-style">{props.beerData.beerStyle}</span>
      <span className="beer-abv">{props.beerData.abv}</span>
      <span className="beer-ibu">{props.beerData.ibu}</span>
    </div>
  );
};

export default BeerCard;
