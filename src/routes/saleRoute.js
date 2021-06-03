const express = require('express');
const router = express.Router();
const SaleController = require('../controller/saleController');
const authenticated = require('../middleware/auth');


router.get('/', authenticated, SaleController.get_sales);


router.get('/add/:id', authenticated, SaleController.get_createSale)

router.post('/add', authenticated, SaleController.post_createSale)


router.get('/report/:id', authenticated, SaleController.get_saleReport)




module.exports = router;