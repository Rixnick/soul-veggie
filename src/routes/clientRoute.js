const express = require('express');
const router = express.Router();
const ClientController = require('../controller/clientController');
const { checkUser } = require('../middleware/auth');

router.get('*', checkUser);

router.get('/', ClientController.get_client);

router.get('/view/:id', ClientController.get_productById)

router.get('/contact', (req, res) => {
  res.render('contact', {

  })
})



router.get('/blogs', (req, res) => {
  res.render('blogs', {

  })
})

module.exports = router;