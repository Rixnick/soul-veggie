const mongoose = require("mongoose");

const sellervegetableSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    vegetable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vegetable",
    },
    desc: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const SellerVegetable = mongoose.model("SellerVegetable", sellervegetableSchema);

module.exports = SellerVegetable;