const mongoose = require("mongoose");

const cateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    vegetables: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vegetable",
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", cateSchema);

module.exports = Category;
