const Seller = require("../models/SellerModel");
const Vegetable = require("../models/vegetable");
const Village = require("../models/VillageModel");
const SellerVegetable = require("../models/SellerVegetable");

module.exports.get_sellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find().populate({ path: "village" });
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
    const villages = await Village.find();
    res.render("Seller/Add", {
      title: "Create Seller",
      villages: villages,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_addSeller = async (req, res, next) => {
  try {
    const { name, address, contact, phone, joinAt } = req.body;

    //Find Vilage by ID
    const villageId = req.body.village;

    //Check Village ID Already Exist
    if (!villageId) console.log("ກະລຸນາເລືອກເຂດ...");

    const village = await Village.findById({ _id: villageId });

    const seller = await Seller.create({
      name: name,
      address: address,
      contact: contact,
      phone: phone,
      joinAt: joinAt,
      village: villageId,
    });

    if (!village.sellers) {
      village.sellers = [seller];
    } else {
      village.sellers.push(seller);
    }

    await village.save();

    res.redirect("/seller");
  } catch (error) {
    console.log(error);
  }
};

module.exports.get_updateSeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const villages = await Village.find();
    const seller = await Seller.findById(id).populate({ path: "village" });

    if (!seller) return console.log("Please select seller ...!");
    res.render("Seller/Edit", {
      name: seller.name,
      address: seller.address,
      contact: seller.contact,
      phone: seller.phone,
      joinAt: seller.joinAt,
      villages: villages,
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
    });
    // console.log(seller.vegetables);
    res.render("Seller/ListVegetable", {
      id: seller._id,
      name: seller.name,
      sellervegetables: seller.vegetables,
    });
  } catch (error) {}
};

module.exports.get_AddSellerVegetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    const vegetable = await Vegetable.find();
    // console.log(seller);
    res.render("Seller/AddSellerVegetable", {
      name: seller.name,
      vegetables: vegetable,
      id: id,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_AddSellerVegetable = async (req, res, next) => {
  try {
    const { desc, qty, price } = req.body;
    const sellerId = req.body.seller;
    const vegetableId = req.body.vegetable;

    // console.log(req.body);

    if (!sellerId) console.log("please select Seller...");
    if (!vegetableId) console.log("please select Vegetable...");

    const myvegetable = await SellerVegetable.create({
      seller: sellerId,
      vegetable: vegetableId,
      desc: desc,
      qty: qty,
      price: price,
    });

    const seller = await Seller.findById({ _id: sellerId });

    if (!seller.vegetables) {
      seller.vegetables = [myvegetable];
    } else {
      seller.vegetables.push(myvegetable);
    }

    await myvegetable.save();
    await seller.save();

    res.redirect("/seller");
  } catch (error) {
    console.log(error);
  }
};
