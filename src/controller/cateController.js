const Category = require('../models/CateModel');


module.exports.get_catePage = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.render('Category/index', {
      title: 'Categories-Page',
      categories
    })
  } catch (error) {
    console.log(error)
  }
  
}


module.exports.get_createCate = (req, res, next) => {
  res.render('Category/Add', {
    title: 'Create Category'
  })
}


module.exports.post_createCate = async (req, res, nex) => {
  try {
    const {name, desc} = req.body;
    const newCategory = new Category({
      name,
      desc
    });

    await newCategory.save();

    res.redirect('/category');
  } catch (error) {
    console.log(error)
  }
}

module.exports.get_updateCate = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if(!category) return console.log("please select Category...!")
    res.render('Category/Edit', {
      title: 'Update Cateogry',
      name: category.name,
      desc: category.desc,
      id: category.id
    })
  } catch (error) {
    console.log(error)
  }
}


module.exports.post_updateCate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.update({_id: id}, req.body);
    res.redirect('/category')
  } catch (error) {
    console.log(error)
  }
}

module.exports.get_deleteCate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.remove({ _id: id });
    res.redirect('/category')
  } catch (error) {
    console.log(error)
  }
}