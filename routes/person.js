const express = require("express");

const Router = express.Router();
const model = require("./../models");
const Moment = require("moment");

// Router.get("/findPerson", async (req, res) => {
//   try {
//     let { page, limit } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);
//     const skip = (page - 1) * limit;

//     const data = await model.person
//       .find({ isDeleted: false })
//       .skip(skip)
//       .limit(limit);
//     const totalUsers = await model.person.countDocuments();
//     console.log("data fetched");

//     res.json({
//       totalUsers,
//       page,
//       totalPages: Math.ceil(totalUsers / limit),
//       data,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "internal error" });
//   }
// });

Router.get("/findPerson", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const aggregatePipeline = [
      { $match: { isDeleted: false } },
      {
        $project: {
          name: 1,
          email: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    console.log("aggregatePipeline: ", JSON.stringify(aggregatePipeline));
    const users = await model.person.aggregate(aggregatePipeline);

    const totalUsers = await model.person.countDocuments({ isDeleted: false });

    res.json({
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

Router.get("/dashboard", async (req, res) => {
  try {
    let sumField = null;

    const startOfWeek = Moment().startOf("week").toDate();
    const endOfWeek = Moment().endOf("week").toDate();

    const startOfMonth = Moment().startOf("month").toDate();
    const endOfMonth = Moment().endOf("month").toDate();

    const startOfYear = Moment().startOf("year").toDate();
    const endOfYear = Moment().endOf("year").toDate();

    const userData = {};
    if (req.query.type === "daily") {
      const pipeline = [
        { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            // count: { $sum: groupKey },
            count: sumField ? { $sum: `$${sumField}` } : { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ];
      const userCounts = await model.person.aggregate(pipeline);
      for (let i = 0; i < 7; i++) {
        const date = Moment(startOfWeek).add(i, "days");
        userData[date.format("YYYY-MM-DD")] = {
          name: date.format("dddd"),
          count: 0,
        };
      }
      userCounts.forEach(({ _id, count }) => {
        if (userData[_id]) {
          userData[_id].count = count;
        }
      });
    }
    if (req.query.type === "weekly") {
      const pipe = [
        { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: sumField ? { $sum: `$${sumField}` } : { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ];
      const userCounts = await model.person.aggregate(pipe);
      const totalWeeks = Math.ceil(Moment(endOfMonth).date() / 7);
      for (let i = 1; i <= totalWeeks; i++) {
        userData[i] = { name: `Week ${i}`, count: 0 };
      }
      userCounts.forEach(({ _id, count }) => {
        const weekNum = Math.ceil(Moment(_id).date() / 7);
        if (userData[weekNum]) {
          userData[weekNum].count += count;
        }
      });
    }
    if (req.query.type === "months") {
      const pipelineOfData = [
        { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: sumField ? { $sum: `$${sumField}` } : { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ];
      const userCounts = await model.person.aggregate(pipelineOfData);

      const totalMonths = 12;

      for (let i = 1; i <= totalMonths; i++) {
        userData[i] = {
          name: Moment()
            .month(i - 1)
            .format("MMMM"),
          count: 0,
        };
      }

      userCounts.forEach(({ _id, count }) => {
        const monthNum = Moment(_id, "YYYY-MM").month() + 1;
        if (userData[monthNum]) {
          userData[monthNum].count += count;
        }
      });
    }

    if (req.query.type === "years") {
      const pipeline = [
        { $match: { createdAt: { $exists: true } } },
        {
          $group: {
            _id: { $year: "$createdAt" },

            count: sumField ? { $sum: `$${sumField}` } : { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ];
      const userCounts = await model.person.aggregate(pipeline);
      const backYear = 5;
      const currentYear = Moment().year();
      for (let i = 0; i < backYear; i++) {
        const year = currentYear - i;
        userData[year] = { name: `${year}`, count: 0 };
      }
      userCounts.forEach(({ _id, count }) => {
        if (userData[_id]) {
          userData[_id].count = count;
        }
      });
    }

    res.status(200).json({ success: true, data: Object.values(userData) });
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = Router;
