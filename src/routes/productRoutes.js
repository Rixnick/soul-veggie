const express = require('express');
const router = express.Router();
const ProductController = require('../controller/productController');
const { authenticated, checkUser } = require('../middleware/auth');


router.get('*', checkUser);

router.get('/', ProductController.all_products);

router.get('/:id', ProductController.product_id);

router.post('/carts/:id', authenticated, ProductController.add_cart);


module.exports = router;