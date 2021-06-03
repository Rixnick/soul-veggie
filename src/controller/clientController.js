const Category = require('../models/CateModel');
const Vegetable = require('../models/vegetable');


module.exports.get_client = async (req, res) => {
  try {
    const vegetable = await Vegetable.find();
    const categories = await Category.find();
    // console.log(categories)
    res.render('Index', {
      categories: categories,
      vegetables: vegetable
    })
  } catch (error) {
    console.log(errpr)
  }
}