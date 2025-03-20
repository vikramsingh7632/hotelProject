const model = require("./../models");

async function createMenu(req, res) {
  try {
    const data = req.body;
    const newMenu = new model.menu(data);
    const response = await newMenu.save();

    console.log("data are saved");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal error" });
  }
}

async function findMenu(req, res) {
  try {
    let { page, limit } = req.query;
    console.log("limit: ", limit);

    page = parseInt(page);
    limit = parseInt(limit);
    console.log("limit: ", limit);
    const skip = (page - 1) * limit;

    const data = await model.menu.find().skip(skip).limit(limit);
    const totalUsers = await model.menu.countDocuments();
    // console.log('totalUsers: ', totalUsers);

    res.json({
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      data,
    });
  } catch (err) {
    console.log(err);
    res.send(500).json({ error: "internal server error" });
  }
}

module.exports = {
  createMenu,
  findMenu,
};
