const express = require("express");
const app = express();
const mongoose = require("mongoose");

const model = require("./models/index")

const dbConnection = "mongodb://localhost:27017/daabha";
mongoose.connect(dbConnection, {
  // useNewUrlParser: true,
  // userUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("connected", () => {
  console.log("connected to mongoDb ");
});
db.on("error", (err) => {
  console.log("mongodb connection error", err);
});

db.on("disconnected", () => {
  console.log("mongoDb disconnected");
});
 

module.exports = db;