const Category = require('../models/CateModel');
const Vegetable = require('../models/vegetable');
const Cart = require('../models/Carts');
const User = require('../models/UserModel');
const qr = require('qrcode');

module.exports.all_products = async (req, res, next) => {
  try {
    const vegetable = await Vegetable.find({}).sort({ createdAt: 'desc' });
    const categories = await Category.find({}).sort({ createdAt: 'desc' });
    res.render('Index', {
      categories: categories,
      vegetables: vegetable
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports.product_id = async (req, res, next) => {
  try {
    const {id} = req.params;
    const vegetable = await Vegetable.findById({ _id: id });
    const categories = await Category.find({}).sort({ createdAt: 'desc' });

    qr.toDataURL(`http://192.168.100.14:5020/products/${id}`, (err, src) => {
      res.render('Products/Product', {
        productId: id,
        src: src,
        vegetable: vegetable,
        categories: categories
      })
    });
  } catch (error) {
    console.log(error)
  }
}

module.exports.get_cart = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const categories = await Category.find({}).sort({ createdAt: 'desc' });

    // console.log("user Id:", user.id);

    const myCart = await User.findById(user.id)
                  .populate({ path: 'carts', populate: {path: 'vegetable'}})
                  .populate({ path: 'sales', findOne: { "index": 0}, populate: { path: 'sales'}})
                  .sort({ createdAt: 'desc'})

    // console.log("Carts sales: ", myCart.sales);


    res.render('Products/Carts', {
      categories: categories,
      carts: myCart.carts,
      saledatas: myCart.sales,
      userId: user.id
    })
  } catch (error) {
    console.log(error)
  }
}


//Post Add carts with vegetable by ID
module.exports.add_cart = async (req, res, next) => {
  //Query user from local user
  const { id } = req.params;

  //Find User who preformed added to cart -- Full logical is userId from logged in user
  const userId = req.body.userId;
  const unit = req.body.unit;
  const price = req.body.price;

  if(!userId) console.log("Please login to processed...!")
  try {
    //Check if the new addCart items is already user.carts
    const user = await User.findById(userId).populate({ path: 'carts', populate: { path: 'vegetable'}});

    // console.log("user cart:", user)

    const findCartItemIndex = user.carts.findIndex(
      (cartItem) => cartItem.vegetable.id === id
    );

    if(findCartItemIndex > -1) {
        //A. the new addToCart item is already Exist is Carts
        //A.1 Find the itemCart from databade /Update
        const CartList = (user.carts[findCartItemIndex].qty += 1);

        await Cart.findByIdAndUpdate(user.carts[findCartItemIndex].id, {
          qty: CartList,
          price: price,
          unit: unit,
        })

        const updatedCartItem = await Cart.findById(
          user.carts[findCartItemIndex].id
        ).populate({ path: 'carts'});

        res.redirect('/user/products')
    }else{
       //B. the new addToCart is not in Cart yet
       const cartItem = await Cart.create({
          vegetable: id,
          qty: 1,
          price: price,
          unit: unit,
          user: userId
       });

       //B.1 Create new cart
       const newCartItem = await Cart.findById(cartItem.id)
                          .populate({ path: 'user'})
                          .sort({ createdAt: 'desc'});
      await User.findByIdAndUpdate(userId, {
        carts: [...user.carts, newCartItem]
      });

      res.redirect('/user/products')
    }

  } catch (error) {
    console.log(error)
  }
}

module.exports.remove_cartById = async (req, res, next) => {
  try {
     //Check ID to match Cart.id
    const { id } = req.params;
    
    const current_user = res.locals.user;

    // console.log("user id:", user.id)

    const userId = current_user.id;
    //Check ID to match Cart.id
    const cart = await Cart.findById(id);

     //Check if user logged in
    if(!userId) console.log("Please login to processed...!");

    const user = await User.findById(userId);


    if(cart.user.toString() !== userId) {
      console.log("you are not authorized ...!")
    }

    const deleteCart = await Cart.findByIdAndRemove(id);

    const updatedUserCart = user.carts.filter(
      (cartId) => cartId.toString() !== deleteCart.id.toString()
    );

    await User.findByIdAndUpdate(userId, {
      carts: updatedUserCart
    })

    res.redirect('/user/products');

  } catch (error) {
    console.log(error)
  }
}