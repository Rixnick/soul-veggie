const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: 6,
      minlength: 3
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    identity: {
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
    profile: {
      data: Buffer,
      contentType: String
    },
    joinAt: {
      type: Date,
      required: true,
    },
    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
