// depedenices
const express = require("express");
require("dotenv").config();
require("./db/index");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const userModel = require("./models/users.model");
const authModel = require("./models/auth.model");
const {
  generateAccessToken,
  authenticateToken,
} = require("./helper/jwt.helper");
const bcryptjs = require("bcryptjs");

// start code here
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const user = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    user.password = bcryptjs.hashSync(user.password, 10);

    await user.save();

    res.status(200).send("Welcome to the club!");
  } catch (err) {
    res.status(500).send("Error registering new user please try again.");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).json({
        error: "Incorrect email or password",
      });
      return;
    }

    // Check if user has a password
    if (!user.password) {
      res.status(401).json({
        error: "Incorrect email or password",
      });
      return;
    }

    // Compare password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        error: "Incorrect email or password",
      });
      return;
    }

    // Issue token
    const accessToken = await generateAccessToken({ email: email });
    const oldAuth = await authModel.findOne({ email: user.email });
    if (oldAuth) {
      await authModel.findByIdAndDelete(oldAuth.id);
    }
    const auth = new authModel({
      email: user.email,
      token: accessToken,
    });

    auth.save();

    res.status(200).json({
      accessToken: auth.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal error please try again",
    });
  }
});

app.use(
  "/graphql",
  authenticateToken,
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Running a GraphQL API server at ${port}`));
