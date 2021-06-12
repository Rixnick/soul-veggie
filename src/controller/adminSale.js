const Seller = require('../models/SellerModel');



module.exports.get_admin_view = async (req, res, next) => {
  const sellers = await Seller.find().populate({ path: 'vegetables', model: 'SellerVegetable'});
  res.render('Admin/Sales', {
    sellers: sellers
  })
}

module.exports.get_adminSaleReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id).populate({
      path: "sales",
    });
    // console.log(seller)
    res.render('Admin/Reports', {
      id: seller._id,
      name: seller.name,
      saleVegetables: seller.sales
    })
  } catch (error) {
    console.log(error);
  }
}
