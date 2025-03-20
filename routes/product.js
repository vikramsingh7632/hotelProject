const express = require("express");

const Router = express.Router();
const model = require("./../models");
const productController = require("../controller").product;

Router.post("/createProduct", productController.createProduct);

Router.get("/productListing", productController.productListing);

Router.get("/productBy/:id",productController.productById);

Router.get("/productByUser/:id", productController.productById);

Router.delete("/deleteProduct/:id", productController.deleteProductId);

module.exports = Router;
