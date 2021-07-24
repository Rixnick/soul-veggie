const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerVegetable",
    }
  ],
  sellers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
  sales: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale",
      },
    ],
   carts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
  roles:{
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  joinAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
