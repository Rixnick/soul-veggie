const express = require('express');
const router = express.Router();
const SellerController = require('../controller/sellerController');
const { authenticated, checkUser }= require('../middleware/auth');


router.get('*', checkUser);

router.get('/', authenticated, SellerController.get_sellers);

router.get('/add',authenticated, SellerController.get_addSeller);

router.post('/add', authenticated, SellerController.post_addSeller);

router.get('/view/:id', authenticated, SellerController.get_sellerId);


router.get('/edit/:id', authenticated, SellerController.get_updateSeller); 

router.post('/edit/:id', authenticated, SellerController.post_updateSeller); 

router.get('/addsellervegetable/:id', authenticated, SellerController.get_AddSellerVegetable);

router.post('/add/sellervegetable', authenticated, SellerController.post_AddSellerVegetable);

router.get('/vegetable/edit/:id', authenticated, SellerController.get_updateUserVegetable);

router.post('/vegetable/edit/:id', authenticated, SellerController.post_updateUserVegetable);

router.get('/vegetable/delete/:id', authenticated, SellerController.get_deleteSellerVegetable);



module.exports = router;