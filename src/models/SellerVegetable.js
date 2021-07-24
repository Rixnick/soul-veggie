const mongoose = require("mongoose");

const sellervegetableSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    unit: {
      required: true,
      type: String
    }
  },
  { timestamps: true }
);

const SellerVegetable = mongoose.model("SellerVegetable", sellervegetableSchema);

module.exports = SellerVegetable;