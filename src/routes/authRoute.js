const express = require('express');
const router = express.Router();
const Authcontroller  = require('../controller/authController');
const SaleController = require('../controller/saleController');
const authenticated = require('../middleware/auth');

router.get('/dashboard', authenticated, Authcontroller.get_home);


router.get('/login', Authcontroller.get_signin);

router.post('/login', Authcontroller.post_signin);

router.get('/register', Authcontroller.get_signup)

router.post('/register', Authcontroller.post_signup)

router.get('/logout', Authcontroller.get_signout)

router.get('/create_profile', Authcontroller.create_profile)


router.get('/profile', Authcontroller.get_profile)


//Get Sales Report admin side



// app.get('/forgetpassword', (req, res, next) => {
//   res.render('Forgetpassword')
// })

// app.get('/resetpassword', (req, res, next) => {
//   res.render('Resetpassword')
// })


module.exports = router;