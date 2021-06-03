const express = require('express');
const router = express.Router();
const ClientController = require('../controller/clientController');

router.get('/', ClientController.get_client);


router.get('/contact', (req, res) => {
  res.render('contact', {

  })
})



router.get('/blogs', (req, res) => {
  res.render('blogs', {

  })
})

module.exports = router;