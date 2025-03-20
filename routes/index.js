const Router = require("express").Router();

const person = require("./person");
const product = require("./product");
const address = require("./address");
const menu = require("./menu");








Router.use("/person", person);
Router.use("/product", product);
Router.use("/address", address);
Router.use("/menu", menu);





module.exports = Router;
