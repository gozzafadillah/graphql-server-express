// connect mongodb
require("dotenv").config();

const mongoose = require("mongoose");
const mongooseString = process.env.DATABASE_URL;

mongoose.connect(mongooseString);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
