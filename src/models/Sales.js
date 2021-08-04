const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SaleItem",
      }
    ],
    qty: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true
  }
);

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;