const User = require("../models/UserModel");
const bcrypt = require('bcryptjs');
const { validateUsername, validateEmail, validatePassword } = require("../utils/isValidated")
const jwt = require('jsonwebtoken');



const maxAge = 3 * 24 * 60 * 60; 
const createToken = (id) => {
  return jwt.sign({id}, process.env.APP_SECRET, {
    expiresIn: maxAge
  })
}


module.exports.get_home = (req, res) => {
  res.render('Home', {
    title:"Xayyaloun-Admin"
  })
}

module.exports.get_signin = (req, res) => {
    res.render('Login', {
      title: 'Signin Gn-O'
    })
}

module.exports.post_signin = async (req, res) => {
  try {
    const {username, password} = req.body;

    //Check empty fill
    if(!username || !password) {
      res.status(400).json({ message: 'Please Fill all require fields...!'})
    }

    //Query user from database
    const user = await User.findOne({ username });
    if(!user) {
      res.status(400).json({ message: 'Not found this username, Please signup, try again...!'})
    }

    //Compare Password
    const isPassword = await bcrypt.compare(password, user.password);
    if(!isPassword){
      res.status(400).json({ message: 'Email or Passowrd incorrect...!'})
    }

     //Create Token
     const token = createToken(user._id)
      
     //Send Token to fronten
     res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})

     //Redirect to user dashboard
     res.redirect('/sales');

  } catch (error) {
    res.status(400).json({ error })
  }
}

module.exports.get_signup = (req, res) => {
  res.render('Register', {
    title: 'Signup Gn-O'
  })
}


module.exports.create_profile = async (req, res, next) => {
  res.render('CreateProfile')
}


module.exports.get_profile = async (req, res, next) => {
  res.render('Profile')
}


module.exports.post_signup = async (req, res) => {
  try {
    const {username, email, password, repassword} = req.body;

    //Check if empty fill
    if(!username || !email || !password || !repassword) {
      res.status(400).json({ message: 'Please Fill all require fields...!'})
    }

    //Validation Username
    const isValidUsername = validateUsername(username);
    if(!isValidUsername) {
      res.status(400).json({ message: 'Please Enter a Username between 3 to 20 characters...'})
    }

    //Validation Email
    const isValidEmail = validateEmail(email);
    if(!isValidEmail) {
      res.status(400).json({ message: 'Please Enter Valid Email'});
    }

    //Validate Password
    const isValidPassword = validatePassword(password);
    if(!isValidPassword) {
      res.status(400).json({ message: 'Please must be leatst at 6 to 60 charecters'})
    }

    //check matched password
    if(password !== repassword) {
      res.status(400).json({ error: 'Password do not match...!'})
    }

    //Check exist username
    const isUsername = await User.findOne({ username });
    if(isUsername){
      res.status(400).json({ error: 'Username already in used...'})
    }

    //Check Existing Email
    const isEmail = await User.findOne({ email });
    if(isEmail) {
      res.status(400).json({ error: 'Email already in used...'})
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    await newUser.save();

    //Create Token
    const token = createToken(newUser._id);

    //Send Token to fronten
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});

    // Redirect to user dashboard
    res.redirect('/user/dashboard');
  } catch (error) {
    res.status(400).json({ error })
  }
}


module.exports.get_signout = (req, res) => {
  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/user/login')
}


