const express = require("express");
const Router = express.Router();
const menu = require("./../models/menu");
const menuItem = require("./../models/menu");
const menuController = require("../controller").menu;




Router.post("/chekMenu",menuController.chekMenu);

Router.get("/findMenu",menuController.findMenu );










module.exports = Router;
