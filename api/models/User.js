const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
