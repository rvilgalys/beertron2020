# Beertron2020

Rim Vilgalys

### Goals

This was a test assignment for a position at BruVue, of outlining a full-stack app that displays a database of beers and allows for a user to select which beers should appear in a simple 'On Draft' menu.

Outline of the tech stack:

- MongoDB Atlas (cloud hosted)
- NodeJS & Express (backend)
- GraphQL (API)
- React (Frontend)
- Artisinal Hand-Carved CSS (Styling)

The tech stack used was somewhat more complex than was really necessary for the assignment, but I wanted to learn more about GraphQl since I'd only really used it inside of Meteor and I wanted to focus on designing APIs. It would be simpler overall to simply connect React right to the cloud Mongo collection.

### Installation

Clone the repository, open an terminal, navigate to the directory and run
`npm install` to install the node modules. Install nodemon with `npm install nodemon --save-dev`.

The following `env` variables also need to be defined:

- `MONGO_USER`
- `MONGO_PASSWORD`
- `MONGO_DB` -- name of the collection in your cluster
- `JWT_KEY` -- not used in the current deployed version

Running `node init.js` will take the data from the `beerData.json` file provided and upload it to the Mongo collection. If run locally, the Mongo IP whitelist will block any attempts. To run this on your own collection, replace the line under `mongoose.connect()` with your own credentials.

`init.js` also fixes some of the duplicates found in the given .json data. It throws an error message because I think somewhere in the JSON file is an entry missing a beer style entry. However it still populates the database with all the beers as far as I am aware.

### Using the app

Since this was a limited assignment, I did not fully implement authorization as I ran out of time to work on it. The user registration and login pages are esssentially only placeholders. The beer database and draft list will currently allow any user to toggle the draft status of any beers.

On the BeerDB page, a single search bar will search the beer names, breweries, and beer styles. Clicking the draft toggle button will create a mutation on the database and toggle a refresh, however this is not yet an instantaneous result on the UI.

### Known Issues and Further Steps

With more time, the following issues could be improved or fixed:

- Fix the Draft Toggle button to instantly change on the UI side and not wait for the database & GraphQL callback.
- Improve some of the CSS so that the page is more responsive and some elements do not clip when the page is shrunk.
- I know the colors are pretty awful.
- Move the current drafts to the top of the search results.
- Do more with the ABV and IBUs, allowing for searching or sorting by these values.
- Standardize the capitalization across the beer names, breweries, and styles.
- Implement lazy-loading of Beer Cards or add extras by page. As implemented right now the DB page only displays 50 results and must be refined by searching.
