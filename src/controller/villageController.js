const Village = require("../models/VillageModel");



module.exports.get_village = async (req, res, next) => {
  try {
    const villages = await Village.find();
    res.render('Village/Index', {
      title: 'All Village',
      villages: villages
    })
  } catch (error) {
    console.log(error)
  }
  next();
}


module.exports.get_addVillage = async (req, res, next) => {
  res.render('Village/Add')
}

module.exports.post_addVillage = async (req, res, next) => {
  try {
    const {area, market, contact, remark, status } = req.body;
    const newVillage = new Village({
      area,
      market,
      contact,
      remark,
      status
    })

    await newVillage.save();

    res.redirect('/village')
  } catch (error) {
    console.log(error)
  }
  next()
}

module.exports.get_updateVillage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const village = await Village.findById(id);

    if(!village) return console.log("ກະລຸນາເລືອກເຂດ...");

    res.render('Village/Edit', {
      title: 'Update Village',
      area: village.area,
      market: village.market,
      contact: village.contact,
      remark: village.remark,
      status: village.status,
      id: village.id
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports.post_updateVillage = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id)
    await Village.update({ _id: id }, req.body);
    res.redirect('/village')
  } catch (error) {
    console.log(error)
  }
}

module.exports.get_deleteVillage = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id)
    await Village.remove({ _id: id });
    res.redirect('/village')
  } catch (error) {
    console.log(error)
  }
}