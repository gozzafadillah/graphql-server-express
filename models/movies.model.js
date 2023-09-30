const { default: mongoose } = require("mongoose");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 255,
  },
  year: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("movies", movieSchema);
