const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vegetable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vegetable",
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
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const SaleItem = mongoose.model("SaleItem", saleItemSchema);

module.exports = SaleItem;