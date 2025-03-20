const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router();
const model = require("./../models");
const address = require("../models/address");
const Address = require("../models/address");
const controller = require("../controller");

Router.post("/createAddress",controller.addres.createAddress);




Router.get("/listing", controller.addres.listing);



Router.get("/addressByuser/:id", controller.addres.listing);

module.exports = Router;
