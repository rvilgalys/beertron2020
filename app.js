const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const isAuth = require("./middleware/is-auth");

const Beer = require("./models/beer");
const User = require("./models/user");

const app = express();

app.use(bodyParser.json());

//app.use(isAuth);
//not enough time to finish this part -- another time alas!

app.use(cors());

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
          draftList: [Beer!]!      
        }

        type AuthData {
          userID: ID!
          token: String!
          tokenExpiration: Int!
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

        input UpdateBeerDraftInput {
          beerID: ID!
          userID: ID!
          tapped: Boolean
        }

        input ToggleDraftStatusInput {
          beerID: ID!
        }

        type RootQuery {
            beers: [Beer!]!
            userDraftList(userEmail: String): [Beer!]!
            login(email: String!, password: String!): AuthData!
        }

        type RootMutation {
            createBeer(beerInput: BeerInput): Beer
            createUser(userInput: UserInput): User
            updateBeerDraft(updateInput: UpdateBeerDraftInput): User
            toggleDraftStatus(toggleDraftInput: ToggleDraftStatusInput): Beer
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

      userDraftList: args => {
        return User.findOne({ email: args.userEmail })
          .then(user => {
            if (!user) {
              throw new Error("User does not exist.");
            }
            return user;
          })
          .then(user => {
            return user._doc.draftList;
          })
          .catch(error => {
            console.log(error);
            throw error;
          });
      },

      createBeer: async (args, req) => {
        // if (!req.isAuth) {
        //   throw new Error("No user is authenticated.");
        // }
        // construct a new object from Mongoose model and push to DB
        const beer = new Beer({
          breweryName: args.beerInput.breweryName,
          beerName: args.beerInput.beerName,
          beerStyle: args.beerInput.beerStyle,
          abv: args.beerInput.abv,
          ibu: args.beerInput.ibu,
          tapped: false,
          creator: req.userID
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
              password: hashedPassword,
              draftList: []
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
      },

      updateBeerDraft: async (args, req) => {
        // if (!req.isAuth) {
        //   throw new Error("No user is authenticated.");
        // }
        // if (req.userID != args.updateInput.userID) {
        //   throw new Error("Users can only update their own draft list.");
        // }
        let updatedUser; // placeholder for later in the promise chain

        return User.findOne({ _id: args.updateInput.userID })
          .populate("draftList")
          .then(user => {
            // first check that user exists
            if (!user) {
              throw new Error("User not found!");
            }
            updatedUser = user; // set placeholder
            return Beer.findById(args.updateInput.beerID); // return updated beer for next action
          })
          .then(updatedBeer => {
            if (!updatedBeer) {
              throw new Error("Beer not found!");
            }
            if (args.updateInput.tapped) {
              // add or remove as needed
              updatedUser.draftList.push(updatedBeer);
            } else {
              updatedUser.draftList.remove(updatedBeer);
            }
            return updatedUser.save();
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
      },

      toggleDraftStatus: async args => {
        return Beer.findById(args.toggleDraftInput.beerID)
          .then(beer => {
            beer.tapped = !beer.tapped;
            beer.save();
            return beer;
          })
          .catch(err => {
            throw err;
          });
      },

      login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("User does not exist.");
        }
        const pwValid = await bcrypt.compare(password, user.password);
        if (!pwValid) {
          throw new Error("Password is invalid."); // we could make these the same message (more secure), but right now separated for easier debugging
        }
        const token = await jwt.sign(
          {
            userID: user.id,
            email: user.email
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          }
        );
        return {
          userID: user.id,
          token: token,
          tokenExpiration: 1
        };
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
    app.listen(process.env.PORT || 4000);
  })
  .catch(err => {
    console.log(err);
  });

module.exports = app;
