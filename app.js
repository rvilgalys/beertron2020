const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Beer = require("./models/beer");
const User = require("./models/user");

const app = express();

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

        type User {
          _id: ID!
          email: String!
          # password is nullable since it will not be returned to any queries
          password: String      
        }


        input BeerInput {
            breweryName: String!
            beerName: String!
            beerStyle: String!
            abv: String!
            ibu: String!
        }

        input UserInput {
          email: String!
          password: String!
        }

        type RootQuery {
            beers: [Beer!]!
        }

        type RootMutation {
            createBeer(beerInput: BeerInput): Beer
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      beers: () => {
        // gather all results from Mongoose, map to an array, destructure from metadata & convert MongoDB id to a string
        return Beer.find()
          .then(beers => {
            return beers.map(beer => {
              return { ...beer._doc, _id: beer._doc._id.toString() };
            });
          })
          .catch(err => {
            throw err;
          });
      },

      createBeer: args => {
        // construct a new object from Mongoose model and push to DB
        const beer = new Beer({
          breweryName: args.beerInput.breweryName,
          beerName: args.beerInput.beerName,
          beerStyle: args.beerInput.beerStyle,
          abv: args.beerInput.abv,
          ibu: args.beerInput.ibu,
          tapped: false,
          creator: "5c340b9a31649313895cecf2"
        });
        // return as a promise
        return beer
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc, _id: result._doc._id.toString() }; // same as above, convert _id to regular string
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },

      createUser: args => {
        return User.findOne({ email: args.userInput.email })
          .then(user => {
            if (user) {
              // check if user exists in DB, will be undefined if not
              throw new Error("Cannot Create User -- Email Already Exists!");
            }
            return bcrypt.hash(args.userInput.password, 12); // encrypt password w 12 rounds of salt
          })
          .then(hashedPassword => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });
            return user.save(); // actually create our new user in the DB
          })
          .then(result => {
            return {
              ...result._doc,
              _id: result._doc._id.toString(),
              password: null // never return these duh
            };
          })
          .catch(err => {
            throw err;
          });
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
