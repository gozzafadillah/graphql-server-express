const userModel = require("../models/users.model");
const moviesModel = require("../models/movies.model");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
} = require("graphql");

// client type
const MoviesType = new GraphQLObjectType({
  name: "Movies",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    year: { type: GraphQLInt },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    movies: {
      type: new GraphQLList(MoviesType),
      resolve(parent, args) {
        return moviesModel.find();
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return userModel.find();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        if (args.name) {
          return userModel.findOne({
            name: new RegExp(args.name, "i"),
          });
        } else if (args.email) {
          return userModel.findOne({ email: args.email });
        }
        return userModel.findById(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
