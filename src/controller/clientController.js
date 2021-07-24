const Category = require('../models/CateModel');
const Vegetable = require('../models/vegetable');
const qr = require('qrcode');




module.exports.get_client = async (req, res) => {
  try {
    const vegetable = await Vegetable.find({}).sort({ createdAt: 'desc' });
    const categories = await Category.find();
    // console.log(categories)
    // console.log("veggies: ", vegetable)
    res.render('Index', {
      categories: categories,
      vegetables: vegetable
    })
  } catch (error) {
    console.log(errpr)
  }
}

module.exports.get_productById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const vegetable = await Vegetable.findById({ _id: id });
    const categories = await Category.find();

    qr.toDataURL(`http://192.168.100.14:2020/view/${id}`, (err, src) => {
      res.render('Product', {
        productId: id,
        src: src,
        vegetable: vegetable,
        categories: categories
      })
    })

  } catch (error) {
    console.log(error)
  }
}