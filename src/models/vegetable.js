const mongoose = require("mongoose");

const vegetableSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: 10,
      minlength: 6
    },
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      required: true,
      type: String
    },
    status: {
      type: Boolean,
      default: true,
    },
    image: {
      data: Buffer,
      contentType: String
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    supiler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suppiler",
    },
    userproduct: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerVegetable",
    }],
  },
  { timestamps: true }
);

const Vegetable = mongoose.model("Vegetable", vegetableSchema);

module.exports = Vegetable;
