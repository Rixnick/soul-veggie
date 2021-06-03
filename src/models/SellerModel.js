const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    vegetables: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerVegetable",
      },
    ],
    sales: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale",
      },
    ],
    joinAt: {
      type: Date,
      required: true,
    },
    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
    },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
