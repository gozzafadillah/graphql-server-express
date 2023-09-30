const express = require("express");
require("dotenv").config();
require("./db/index");
const { graphqlHTTP } = require("express-graphql");
const port = process.env.PORT || 4000;
const schema = require("./schema/schema");

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Running a GraphQL API server at ${port}`));
