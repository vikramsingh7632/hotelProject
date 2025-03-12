const express = require("express");

const Router = express.Router();
const model = require("./../models");
const moment = require("moments");

Router.get("/findPerson", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const data = await model.person
      .find({ isDeleted: false })
      .skip(skip)
      .limit(limit);
    const totalUsers = await model.person.countDocuments();
    console.log("data fetched");

    res.json({
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      data,
    });
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
    const newPerson = new model.person(data);
    const response = await newPerson.save();
    console.log("data saved");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal error" });
  }
});

Router.get("/userCount", async (req, res) => {
  try {
    let type = req.query.type;
    let userCount;

    const today = new Date();
    const firstweek = new Date(today.setDate(today.getDate() - today.getDay()));
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const allBackYear = new Date(today.getFullYear(), 0, 1);

    if (type == "today") {
      userCount = await model.person.countDocuments({
        createdAt: { $gte: today },
      });
    } else if (type == "firstWeek") {
      userCount = await model.person.countDocuments({
        createdAt: { $gte: firstweek },
      });
    } else if (type == "firstDayOfMonth") {
      userCount = await model.person.countDocuments({
        createdAt: { $gte: firstDayOfMonth },
      });
    } else if (type == "firstDayOfYear") {
      userCount = await model.person.countDocuments({
        createdAt: { $gte: firstDayOfYear },
      });
    } else if (type == "allPreviousData") {
      userCount = await model.person.countDocuments({
        createdAt: { $lte: allBackYear },
      });
    }

    res.status(200).json({ success: true, data: userCount });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

Router.delete("/deletedUser", async (req, res) => {
  try {
    let id = req.body.id;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const data = await model.person.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User marked as deleted", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

Router.delete("/deletedUserCount", async (req, res) => {
  try {
    const { type } = req.query;
    let deleteCount;

    const today = new Date();
    const firstweek = new Date(today.setDate(today.getDate() - today.getDay()));
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const allBackYear = new Date(today.getFullYear(), 0, 1);

    if (type == "today") {
      deleteCount = await model.person.countDocuments({
        deletedAt: { $gte: today },
      });
    } else if (type == "firstWeek") {
      deleteCount = await model.person.countDocuments({
        deletedAt: { $gte: firstweek },
      });
    } else if (type == "firstDayOfMonth") {
      deleteCount = await model.person.countDocuments({
        deletedAt: { $gte: firstDayOfMonth },
      });
    } else if (type == "firstDayOfYear") {
      deleteCount = await model.person.countDocuments({
        deletedAt: { $gte: firstDayOfYear },
      });
    } else if (type == "deletePreviousData") {
      deleteCount = await model.person.countDocuments({
        deletedAt: { $lte: allBackYear },
      });
    }
    res.status(200).json({ success: true, data: deleteCount });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = Router;
