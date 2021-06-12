const express = require('express');
const router = express.Router();
const AdminSaleController = require('../controller/adminSale');
const authenticated = require('../middleware/auth');


router.get('/', authenticated, AdminSaleController.get_admin_view);


// router.get('/add/:id', authenticated, SaleController.get_createSale)

// router.post('/add', authenticated, SaleController.post_createSale)


router.get('/report/:id', authenticated, AdminSaleController.get_adminSaleReport)






module.exports = router;