const express = require('express');
const router = express.Router();
const ProductController = require('../controller/productController');
const Authcontroller  = require('../controller/authController');
const { authenticated, checkUser } = require('../middleware/auth');



router.get('/login', Authcontroller.get_signin);

router.post('/login', Authcontroller.post_signin);




//Get Sales Report admin side
router.get('*', checkUser);

router.get('/', authenticated, Authcontroller.get_allUsers)

router.get('/create-account', authenticated, Authcontroller.create_account);

router.get('/view/:id', authenticated, Authcontroller.get_userProfile)

router.post('/register', authenticated, Authcontroller.post_signup);


router.get('/dashboard', authenticated, Authcontroller.get_home);

router.get('/products', authenticated, Authcontroller.get_userProducts)


router.get('/carts', authenticated, ProductController.get_cart);

router.get('/carts/:id', authenticated, ProductController.remove_cartById);


router.get('/logout', Authcontroller.get_signout);



module.exports = router;