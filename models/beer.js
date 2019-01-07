const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const beerSchema = new Schema({
  breweryName: {
    type: String,
    required: true
  },
  beerName: {
    type: String,
    required: true
  },
  beerStyle: {
    type: String,
    required: true
  },
  abv: {
    type: String,
    required: true
  },
  ibu: {
    type: String,
    required: true
  },
  tapped: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Beer", beerSchema);
