const express = require('express');
const router = express.Router();
const CateController = require('../controller/cateController');
const authenticated = require('../middleware/auth');



router.get('/', authenticated, CateController.get_catePage);


router.get('/add', authenticated, CateController.get_createCate);


router.post('/add', authenticated, CateController.post_createCate);


router.get('/edit/:id', authenticated, CateController.get_updateCate);


router.post('/edit/:id', authenticated, CateController.post_updateCate);


router.get('/delete/:id', authenticated, CateController.get_deleteCate);

module.exports = router;