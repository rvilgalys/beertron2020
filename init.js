const mongoose = require("mongoose");
const beerData = require("./beerData.json");

const Beer = require("./models/beer");

mongoose
  .connect(
    `mongodb+srv://beerAdmin:hopasauras@cluster0-czne4.mongodb.net/beer-database?retryWrites=true`
  )
  .then(() => {
    return Array.from(beerData)
      .filter(entry => {
        return (testBeer = Beer.findOne({
          // first filter out dupblicates
          breweryName: entry["Brewery Name"],
          beerName: entry["Beer Name"]
        })
          .then(beer => {
            return testBeer;
          })
          .catch(err => {
            throw err;
          }));
      })
      .map(entry => {
        // map them to the DB
        const beer = new Beer({
          breweryName: entry["Brewery Name"],
          beerName: entry["Beer Name"],
          beerStyle: entry["Beer Style"],
          abv: entry["ABV"],
          ibu: entry["IBU"],
          tapped: false,
          creator: "5c3413526da647158b74f6aa"
        });

        return beer
          .save()
          .then(beer => {
            return beer;
          })
          .catch(err => {
            throw err;
          });
      });
  })
  .then(array => {
    console.log(array);
  })
  .catch(err => {
    // this throws an error because somewhere a beerstyle is missing? still populates DB
    console.log(err);
    throw err;
  });
