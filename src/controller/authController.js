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
      title: 'Signin Soul-Veggies'
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
     res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});


     //Redirect to user dashboard
     res.redirect('/user/products');

  } catch (error) {
    res.status(400).json({ error })
  }
}


module.exports.post_signup = async (req, res) => {
  try {
    const {username, email, password, repassword, roles} = req.body;

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
      password: hashedPassword,
      roles
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

//Admin User Controller Data
module.exports.create_account = async (req, res, next) => {
  try {
    res.render('Admin/CreateAc')
  } catch (error) {
    console.log(error)
  }
}

//Display All user from system
module.exports.get_allUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: 'desc'})

    // console.log("User data:", users)
    res.render('Admin/Users', {
      users: users,
    })
  } catch (error) {
    console.log(error)
  }
}



module.exports.get_userProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({ path: 'sellers' });

    // console.log("user profile: ", user)

    res.render('Users/Profile', {
      profile: user.sellers.profile,
      name: user.sellers.name,
      surname: user.sellers.surname,
      email: user.email,
      contact: user.sellers.contact,
      address: user.sellers.address,
      joinAt: user.joinAt
    })


  } catch (error) {
    console.log(error)
  }
}


//User owner products
module.exports.get_userProducts = async (req, res, next) => {
 try {
  const user = res.locals.user;

  // console.log(user)

  const userId = user.id;

  const myInfo = await User.findById({ _id: user.id })
                    .populate({ 
                      path: 'products', 
                      populate: [{ path: 'vegetable'}]
                    })
                    .populate({ path: 'sales'}).sort({ createdAt: 'desc'});
  res.render('Users/Index', {
    products: myInfo.products,
    userId: userId
  });
 } catch (error) {
   console.log(error)
 }
}
