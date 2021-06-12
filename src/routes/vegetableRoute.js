const express = require('express');
const router = express.Router();

const VegetableController = require('../controller/vegetableController');
const authenticated = require('../middleware/auth');

router.get('/', authenticated, VegetableController.get_vegetable);


router.get('/add', authenticated, VegetableController.get_addVegetable);

router.post('/add', authenticated, VegetableController.post_addVegetable);

router.get('/view/:id', authenticated, VegetableController.get_vegetableById);

router.get('/edit/:id', authenticated, VegetableController.get_updateVegetable)

router.post('/edit/:id', authenticated, VegetableController.post_updateVegetable)

router.get('/delete/:id', authenticated, VegetableController.get_deleteVegetable)


module.exports = router;