const mongoose = require("mongoose");

const vegetableSchema = new mongoose.Schema(
  {
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
    qty: {
      type: Number,
      required: true,
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
    }
  },
  { timestamps: true }
);

const Vegetable = mongoose.model("Vegetable", vegetableSchema);

module.exports = Vegetable;
