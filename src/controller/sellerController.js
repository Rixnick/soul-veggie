const path = require('path');
const fs = require('fs');
const Seller = require("../models/SellerModel");
const Vegetable = require("../models/vegetable");
const Village = require("../models/VillageModel");
const SellerVegetable = require("../models/SellerVegetable");
const User = require("../models/UserModel");

module.exports.get_sellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find().populate({ path: "village" }).sort({ createdAt: 'desc'});
    // console.log(sellers);
    res.render("Seller/Index", {
      title: "Sellers Page",
      sellers: sellers,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.get_addSeller = async (req, res, next) => {
  try {
    const villages = await Village.find({}).sort({ createdAt: 'desc'});
    const users = await User.find({}).sort({ joinAt: 'desc' })
    res.render("Seller/Add", {
      title: "Create Seller",
      villages: villages,
      users: users
    });
  } catch (error) {
    console.log(error);
  }
};
 
module.exports.post_addSeller = async (req, res, next) => {
  // console.log(req.body);
  // 
  try {
    const {code, name, surname, identity, address, contact, phone, joinAt, status } = req.body;

    //Query Village ID:
    const villageId = req.body.village;

    //Query User ID:
    const userId = req.body.user;

    //upload profile image
    const file = req.files.imageProfile;
    // console.log(file)
    const fileName = new Date().getTime().toString() + path.extname(file.name);
    const savePath = path.join(__dirname, '../', '../', 'public', 'uploads', 'profiles', fileName);
    if(file.truncated){
      throw new Error('File is too big...!')
    }

    await file.mv(savePath);

    if(!villageId) console.log('ກະລຸນາເລືອກຕະຫລາດ...');

    const village = await Village.findById({ _id: villageId });

    if(!userId) console.log('ກະລຸນາລັອກອີນກ່ອນ...');

    const user = await User.findById({ _id: userId });

    const seller = await Seller.create({
      code: code,
      name: name,
      surname: surname,
      identity: identity,
      address: address,
      contact: contact,
      phone: phone,
      joinAt: joinAt,
      status: status,
      user: userId,
      village: villageId,
      profile: {
        data: fs.readFileSync(savePath),
        contentType: 'image/png'
      }
    })

    if(!village.seller){
      village.sellers = [seller];
    }else{
      village.sellers.push(seller);
    }

    if(!user.sellers){
      user.sellers = seller;
    }else{
      user.sellers.push(seller);
    }

    await village.save();
    await user.save();

    res.redirect('/seller');

  } catch (error) {
    console.log(error)
  }
};

module.exports.get_updateSeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const villages = await Village.find({}).sort({ createdAt: 'desc' });
    const seller = await Seller.findById(id).populate({ path: "village" }).populate({ path: 'user'});
    // console.log(seller)
    const userMarket = seller.village.market;

    if (!seller) return console.log("Please select seller ...!");
    res.render("Seller/Edit", {
      code: seller.code,
      name: seller.name,
      surname: seller.surname,
      identity: seller.identity,
      address: seller.address,
      contact: seller.contact,
      phone: seller.phone,
      joinAt: seller.joinAt,
      village: userMarket,
      villages: villages,
      profile: seller.profile,
      user: seller.user.username,
      id: seller.id,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_updateSeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id)
    await Seller.update({ _id: id }, req.body);
    res.redirect("/seller");
  } catch (error) {
    console.log(error);
  }
};

//Seller Vegetable list************************************
module.exports.get_sellerId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate({
      path: "vegetables",
      model: "SellerVegetable",
      populate: { path: "vegetable" },
    }).populate({ path: "user"});

    // console.log("Seller Info:", seller);

    const userId = seller.user._id;

    // console.log("user owner id:",userId)

    const user = await User.findById({ _id: userId }).populate({ 
      path: 'products', 
      model: SellerVegetable,
      populate: [{ path: 'vegetable'}]
    }).sort({ createdAt: 'desc' });
    
    // console.log("list user product:", user);
    res.render("Seller/ListVegetable", {
      id: seller._id,
      name: seller.name,
      userId: userId,
      products: user.products,
    });
  } catch (error) {}
};

module.exports.get_AddSellerVegetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate({ path: 'user'});
    const vegetable = await Vegetable.find();

    const userId = seller.user.id;
    // console.log("user Id:",userId);
    res.render("Seller/AddSellerVegetable", {
      code: seller.code,
      name: seller.name,
      vegetables: vegetable,
      id: id,
      userId: userId
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_AddSellerVegetable = async (req, res, next) => {
  try {
    const { desc, qty, unit, price } = req.body;
    const userId = req.body.user;
    const vegetableId = req.body.vegetable;
    const sellerId = req.body.seller;

    // console.log(req.body);

    if (!userId) console.log("please select Seller...");
    if (!vegetableId) console.log("please select Vegetable...");

    const myvegetable = await SellerVegetable.create({
      desc: desc,
      qty: qty,
      unit: unit,
      price: price,
      user: userId,
      vegetable: vegetableId
    });

    // console.log(myvegetable)

    const user = await User.findById({ _id: userId });

    const vegetable = await Vegetable.findById({ _id: vegetableId });

    if (!user.products) {
      user.products = [myvegetable];
    } else {
      user.products.push(myvegetable);
    }

    if(!vegetable.userproduct){
      vegetable.userproduct = [myvegetable];
    }else{
      vegetable.userproduct.push(myvegetable);
    }



    await myvegetable.save();
    await vegetable.save();
    await user.save();

    res.redirect(`/seller/view/${sellerId}`);
  } catch (error) {
    console.log(error);
  }
};


//Update User Vegetable
module.exports.get_updateUserVegetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sellerVegetable = await SellerVegetable.findById(id).populate({ path: 'vegetable'}).populate({ path: 'user', populate: { path: 'sellers'}});

    // console.log("Data:", sellerVegetable)
 
    res.render('Seller/UpdateSellerVegetable', {
      userId: sellerVegetable.user.id,
      sellerId: sellerVegetable.user.sellers.id,
      username: sellerVegetable.user.sellers.name,
      vegetable: sellerVegetable.vegetable.name,
      vegetableId: sellerVegetable.vegetable.id,
      desc: sellerVegetable.desc,
      unit: sellerVegetable.unit,
      qty: sellerVegetable.qty,
      price: sellerVegetable.price,
      id: id
    })
  } catch (error) {
    console.log(error)
  }
}


//Update Post Data
module.exports.post_updateUserVegetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sellerId = req.body.sellerId;

    await SellerVegetable.update({ _id: id }, req.body);

    res.redirect(`/seller/view/${sellerId}`)
  } catch (error) {
    console.log(error)
  }
}


//GET Delete Seller Vegetable Items
module.exports.get_deleteSellerVegetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    await SellerVegetable.remove({ _id: id }, req.body);
    //Show Item 
    res.redirect('/seller')
  } catch (error) {
    console.log(error)
  }
}