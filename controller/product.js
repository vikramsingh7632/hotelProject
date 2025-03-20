const model = require("./../models");

 async function createProduct (req, res) {
  try {
    const data = req.body;
    const newPerson = new model.product(data);
    const response = await newPerson.save();
    console.log("data saved");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal error" });
  }
}
async function productListing (req, res) {
  try {
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const data = await model.product
      .find({ isDeleted: false })
      .populate("userId")
      .skip(skip)
      .limit(limit);
    const totalUsers = await model.product.countDocuments({ isDeleted: false });
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
}
 async function productById (req, res)  {
  try {
    const data = req.params.id;
    const productData = await model.product.findById(data).populate("userId");

    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ data: productData, message: "sucess productData are fetched" });
    console.log("productData: ", productData);
  } catch (error) {
    console.log("error: ", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
async function productByuserId (req, res) {
  try {
    const userId = req.params.id;
    const productUser = await model.product.find({ userId: userId });
    console.log("productUser: ", productUser);
    res
      .status(200)
      .json({ data: productUser, message: "sucess data are fetched" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
}
async function deleteProductId(req, res)  {
  try {
    const deleteId = req.params.id;
    const deleteProduct = await model.product.findOneAndUpdate(
      { _id: deleteId, isDeleted: false },
      { isDeleted: true }
    );
    if (!deleteProduct) throw new Error("Product not found");
    console.log("deleteProduct: ", deleteProduct);
    res.status(200).json({ data: deleteProduct, message: "data are updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
    createProduct,
    productListing,
    productById,
    productByuserId,
    deleteProductId,
}