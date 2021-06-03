const Seller = require('../models/SellerModel');
const SellerVegetable = require('../models/SellerVegetable');
const SaleModel = require('../models/SaleModel');

module.exports.get_sales = async (req, res, next) => {
  try {
    const sellers = await Seller.find().populate({ path: 'vegetables', model: 'SellerVegetable'});
    // console.log(sellers)
    res.render('Sales/Index', {
      sellers: sellers
    })
  } catch (error) {
    
  }
  
}


module.exports.get_admin_view = async (req, res, next) => {
  res.render('Admin/Sales', {
    
  })
}


module.exports.get_createSale = async (req, res) => {
  try {
    const { id } = req.params;
    
    const seller = await Seller.findById(id).populate({
      path: "vegetables",
      model: "SellerVegetable",
      populate: { path: "vegetable" },
    });
    // console.log("Seller info:", seller);
    //console.log(sellerVegetables.vegetable)

    res.render('Sales/Create', {
      id: seller._id,
      name: seller.name,
      vegetables: seller.vegetables
    })
  } catch (error) {
    console.log(error)
  }
}


module.exports.post_createSale = async (req, res, next) => {
  try {
    // console.log(req.body)
    const {desc, qty_sales, sale_amount, stock_qty} = req.body;
    const sellerId = req.body.seller;
    const [vegetableId] = req.body.vegetables;

    //Check if not selecct one
    if(!sellerId) console.log("please select Seller...");
    if(!vegetableId) console.log("please select Vegetable...");

    const mySale = await SaleModel.create({
      seller: sellerId,
      saleVegetable: [vegetableId],
      desc: desc,
      qty_sale: qty_sales,
      sale_amount: sale_amount,
      stock_qty: stock_qty
    })

    const seller = await Seller.findById({ _id: sellerId });

    if(!seller.sales){
      seller.sales = [mySale];
    }else{
      seller.sales.push(mySale);
    }

    await mySale.save();
    await seller.save();

    res.redirect('/sales')
  } catch (error) {
    console.log(error);
  }
}

module.exports.get_saleReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const seller = await Seller.findById(id).populate({ path: 'sales' });

    // console.log(seller);

    res.render('Sales/Report', {
      id: seller._id,
      name: seller.name,
      saleVegetables: seller.sales
    });

  } catch (error) {
    console.log(error);
  }
  
}