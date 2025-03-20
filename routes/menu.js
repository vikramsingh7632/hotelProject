const express = require("express");
const Router = express.Router();
const menuController = require("../controller").menu;




Router.post("/createMenu",menuController.createMenu);

Router.get("/findMenu",menuController.findMenu );










module.exports = Router;
