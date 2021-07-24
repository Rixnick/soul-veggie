const express = require('express');
const router = express.Router();
const SaleController = require('../controller/saleController');
const { authenticated, checkUser } = require('../middleware/auth');

router.get('*', checkUser);

router.get('/', authenticated, SaleController.get_allSales);

router.get('/report/:id', authenticated, SaleController.get_saleReport);

router.get('/report/invoice/:id', authenticated, SaleController.get_Invoice);

router.post('/create-sale', authenticated, SaleController.create_sale);

router.get('/my-sales', authenticated, SaleController.get_userSale);

router.get('/invoice/:id', authenticated, SaleController.my_Invoice);






module.exports = router;