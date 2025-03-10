const express = require("express");

const Router = express.Router();
const model = require("./../models");

Router.get("/findPerson", async (req, res) => {
  try {
    const data = await person.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal error" });
  }
});

Router.get("/work/:workType", async (req, res) => {
  try {
    const workType = req.params.workType;
    if (workType == "chef" || workType == "manager" || workType == "owner") {
      const response = await model.person.find({ work: workType });
      console.log("response fetchhed");
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "invalid work type" });
    }
  } catch (err) {
    res.status(500).json({ error: "invalid server error!!" });
  }
});

Router.post("/createPerson", async (req, res) => {
  try {
    const data = req.body;
    const newPerson = new person(data);
    const response = await newPerson.save();
    console.log("data saved");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal error" });
  }
});

module.exports = Router;
