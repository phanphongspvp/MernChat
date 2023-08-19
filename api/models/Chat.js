const mongoose = require("mongoose");

const Chat = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, require: true, ref: "User" },
    recipient: { type: mongoose.Schema.ObjectId, require: true, ref: "User" },
    text: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", Chat);
