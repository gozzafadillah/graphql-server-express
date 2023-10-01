const { default: mongoose } = require("mongoose");

const authSchema = mongoose.Schema({
  email: {
    type: String,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("auth", authSchema);
