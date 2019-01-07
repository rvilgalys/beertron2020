const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const app = express();

const beers = [];

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type Beer {
            _id: ID!
            breweryName: String!
            beerName: String!
            beerStyle: String!
            abv: String!
            ibu: String!
            tapped: Boolean!
        }

        input BeerInput {
            breweryName: String!
            beerName: String!
            beerStyle: String!
            abv: String!
            ibu: String!
        }

        type RootQuery {
            beers: [Beer!]!
        }

        type RootMutation {
            createBeer(beerInput: BeerInput): Beer
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      beers: () => {
        return beers;
      },
      createBeer: args => {
        const beer = {
          _id: Math.random(1000),
          breweryName: args.beerInput.breweryName,
          beerName: args.beerInput.beerName,
          beerStyle: args.beerInput.beerStyle,
          abv: args.beerInput.abv,
          ibu: args.beerInput.ibu,
          tapped: false
        };
        beers.push(beer);
        return beer;
      }
    },
    graphiql: true
  })
);

app.get("/", (req, res, next) => {
  res.send("Beers");
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-czne4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
