const Sales = require('../models/Sales');
const SaleItem = require('../models/SaleItems');
const User = require('../models/UserModel');
const Cart = require('../models/Carts');



module.exports.get_allSales = async (req, res, next) => {
  try {
    const users = await User.find().populate({ path: 'sales' }).populate({ path: 'sellers' }).sort({ jointAt: 'desc'})

    res.render('Admin/Sales', {
      users: users
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports.get_saleReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({ path: 'sales', populate: { path: 'items'}}).sort({ createdAt: 'desc'});

    // console.log("single user sale Report", user);

    res.render('Admin/Reports', {
      sales: user.sales
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports.get_Invoice = async (req, res, next) => {
  try {

    const { id } = req.params;

    const items = await Sales.findById(id).populate({ path: 'items', populate: { path: 'vegetable'}}).sort({ createdAt: 'desc'});

    res.render('Admin/Invoice', {
      sales: items
    })
  } catch (error) {
    console.log(error)
  }
}

//Post Create Sale Product from carts item
module.exports.create_sale = async (req, res, next) => {
  try {

    const { amount, totalqty } = req.body;

    //Check Sale date all ready create
    const userId = req.body.userId;


    if(!userId) console.log("Please login to processed...!");

    const user = await User.findById(userId)
                .populate({ path: 'carts', populate: { path: 'vegetable'}})
                .populate({ path: 'sales', populate: { path: 'items'}})
                .sort({ createdAt: 'desc'});

    // console.log("User:", user);
    //Convert Cart to SaleItem
    const convertCartToSaleItem = async () => {
      return Promise.all(
        user.carts.map((cart) => 
          SaleItem.create({
            vegetable: cart.vegetable,
            price: cart.price,
            qty: cart.qty,
            unit: cart.unit,
            user: userId
          })
        )
      );
    }

    const saleItems = await convertCartToSaleItem();

    // console.log(saleItems)

    const sales = await Sales.create({
      items: saleItems.map((saleItem) => saleItem.id),
      qty: totalqty,
      amount: amount
    });

    //Delete item from cart
    const deleteCartItem = async () => {
      return Promise.all(
        user.carts.map((cart) => Cart.findByIdAndRemove(cart.id))
      );
    }

    if(!user.sales) {
      user.sales = [sales]
    }else {
      user.sales.push(sales)
    }


    await deleteCartItem();

    await user.save()

    res.redirect('/user/products');
  } catch (error) {
     console.log(error)

  }
}


//Get User Sale Products from date
module.exports.get_userSale = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const mySales = await User.findById(user.id)
                    .populate({ path: 'sales', 
                        populate: { path: 'items', 
                            populate: { path: 'vegetable'}
                        }
                    })
                    .sort({ createdAt: 'desc'});

    // console.log("user sales data:", mySales)

    res.render('Sales/Index', {
      my_sales: mySales.sales
    })
  } catch (error) {
    console.log(error)
  }
}

//User Sale Invoice
module.exports.my_Invoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = res.locals.user;

    // console.log(user)
    const sales = await Sales.findById(id).populate({ path: 'items', populate: { path: 'vegetable'}})

    // console.log("req ID:", sales);

    
    res.render('Sales/Invoice', {
      username: user.sellers.name,
      sales: sales,
    })
  } catch (error) {
    
  }
}


//Display all user Sale
