const express = require("express");
const Router = express.Router();
const controller = require("../controller");

Router.post("/createAddress",controller.addres.createAddress);




Router.get("/listing", controller.addres.listing);



Router.get("/addressByuser/:id", controller.addres.addressByUserId);

module.exports = Router;
