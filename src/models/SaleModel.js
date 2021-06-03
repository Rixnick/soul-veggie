const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    saleVegetable: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerVegetable",
    }],
    desc: {
      type: String,
    },
    qty_sale: {
      type: Number,
      required: true,
    },
    sale_amount:{
      type: Number,
      required: true,
    },
    stock_qty:{
      type: Number,
      required: true,
    } 
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;