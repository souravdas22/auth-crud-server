const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  mobile: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});
const user = mongoose.model("User", userSchema);

module.exports = user;
