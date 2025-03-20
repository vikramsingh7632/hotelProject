const express = require("express");
const Router = express.Router();

const controller = require("../controller")
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

Router.get("/findPerson", controller.person.personList);

Router.get("/work/:workType", controller.person.workType);

Router.post("/createPerson",controller.person.createPerson);

Router.get("/userCount",controller.person.userCount);

Router.delete("/deletedUser", controller.person.deletedUser);

Router.delete("/deletedUserCount", controller.person.deletedUserCount);

Router.get("/dashboard",controller.person.dashboard);

module.exports = Router;
