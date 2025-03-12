const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    colour: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "person",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date },
  },

  { timestamps: true }
);

const product = mongoose.model("product", productSchema);
module.exports = product;
