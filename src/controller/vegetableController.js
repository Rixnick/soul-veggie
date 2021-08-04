const path = require('path');
const fs = require('fs');
const Category = require("../models/CateModel");
const Vegetable = require('../models/vegetable');
const qr = require('qrcode');

module.exports.get_vegetable = async (req, res, next) => {
  try {
    const vegetable = await Vegetable.find({}).populate({ path: 'category' }).sort({ createdAt: 'desc' });
    // console.log("Vegetable: ", vegetable)
    res.render('Vegetable/Index', {
      title: 'All Vegetable', 
      vegetables: vegetable
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports.get_addVegetable = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.render('Vegetable/Add', {
      title: 'Create Vegetable',
      categories: categories
    })
  } catch (error) {
    console.log(error)
  }
}


module.exports.get_vegetableById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vegetable = await Vegetable.findById({ _id: id });

    // console.log(vegetable)
    qr.toDataURL(`http://192.168.100.14:5020/vegetable/view/${id}`, (err, src) => {
      if(err) res.send('error occured');
       res.render('Vegetable/View', {
          productId: id,
          src: src,
          vegetable: vegetable
        })
    })
    
  } catch (error) {
    console.log(error)
  }
}


module.exports.post_addVegetable = async (req, res, next) => {
  try {
    const { code, name, desc, price, unit, status } = req.body;

    const cmprice = price.replace(/,\s?/g, "");

    //Query Categroy ID:
    const categoryId = req.body.category;

    //Upload imgage File
    const file = req.files.imagefile;
    const fileName = new Date().getTime().toString() + path.extname(file.name);
    const savePath = path.join(__dirname, '../', '../', 'public', 'uploads', 'vegetables', fileName);
    if(file.truncated){
      throw new Error('File is too big...!')
    }
    await file.mv(savePath);

    //Check Category ID Ready exist 
    if(!categoryId) console.log('ກະລຸນາເລືອກປະເພດຜັກ...');

    const category = await Category.findById({ _id: categoryId });

    const vegetable = await Vegetable.create({
      code: code,
      name: name,
      desc: desc,
      price: cmprice,
      unit: unit,
      status: status,
      category: categoryId,
      image: {
        data: fs.readFileSync(savePath),
        contentType: 'image/png'
      }
    })


    if(!category.vegetables) {
      category.vegetables = [vegetable];
    }else {
      category.vegetables.push(vegetable)
    }

    await category.save();

    res.redirect('/vegetable');

  } catch (error) {
    console.log(error)
  }
}

module.exports.get_updateVegetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categories = await Category.find();
    const vegetable = await Vegetable.findById(id).populate({ path: 'category' });
    if(!vegetable) return console.log('Please select Vegetable...!');
    res.render('Vegetable/Edit', {
      name: vegetable.name,
      desc: vegetable.desc,
      price: vegetable.price,
      qty: vegetable.qty,
      status: vegetable.status,
      image: vegetable.image,
      categories: categories,
      id: vegetable.id
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports.post_updateVegetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Vegetable.update({ _id: id }, req.body);
    res.redirect('/vegetable');
  } catch (error) {
    console.log(error)
  }
}


module.exports.get_deleteVegetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Vegetable.remove({ _id: id }, req.body)
    
    res.redirect('/vegetable');
  } catch (error) {
    console.log(error)
  }
}