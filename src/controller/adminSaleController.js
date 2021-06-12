

module.exports.get_admin_view = async (req, res, next) => {
  const sellers = await Seller.find().populate({ path: 'vegetables', model: 'SellerVegetable'});
  res.render('Admin/Sales', {
    sellers: sellers
  })
}

module.exports.get_adminSaleReport = async (req, res, next) => {
  res.send("Admin Sale Report")
}
