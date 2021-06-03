const express = require('express');
const router = express.Router();
const VillageController = require('../controller/villageController');
const authenticated = require('../middleware/auth');

router.get('/', authenticated, VillageController.get_village);


router.get('/add', authenticated, VillageController.get_addVillage);


router.post('/add', authenticated, VillageController.post_addVillage);


router.get('/edit/:id', authenticated, VillageController.get_updateVillage);


router.post('/edit/:id', authenticated, VillageController.post_updateVillage);



router.get('/delete/:id', authenticated, VillageController.get_deleteVillage)

module.exports = router;
















