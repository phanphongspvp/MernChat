const mongoose = require("mongoose");

const connect = async (db_url) => {
  try {
    await mongoose.connect(db_url);
    console.log("Connect MongoDB Success.");
  } catch (error) {
    console.log("Connect MongoDB Failure.");
  }
};

module.exports = { connect };
