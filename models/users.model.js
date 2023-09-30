const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
});

module.exports = mongoose.model("users", userSchema);
