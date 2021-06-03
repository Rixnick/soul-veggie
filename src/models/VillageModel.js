const mongoose = require("mongoose");

const villageSchema = new mongoose.Schema(
  {
    area: {
      type: String,
      required: true,
    },
    market: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    sellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
      }
    ],
  },
  { timestamps: true }
);

const Village = mongoose.model("Village", villageSchema);

module.exports = Village;
