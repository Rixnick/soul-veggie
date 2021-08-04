const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");


const authenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if(token) {
    jwt.verify(token, process.env.APP_SECRET, (error, decodedToken) => {
      if(error) {
        console.log(error.message)
        res.redirect('/user/login')
      }else{
        // console.log('Decoded Info:', decodedToken)
        next();
      }
   })
  }else{
    res.redirect('/user/login')
  }

}


//Check currenty User
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if(token){
    jwt.verify(token, process.env.APP_SECRET, async (error, decodedToken) => {
      if(error) {
        console.log(error.message)
        res.locals.user = null;
        next();
      }else{
        // console.log('Decoded Info:', decodedToken);
        let user = await User.findById(decodedToken.id)
                .populate({ path: 'sellers' })
                .populate({ path: 'carts', populate: { path: 'vegetable'}})
                .populate({ path: 'sales'});
        // console.log("user carts: ", user.carts)
        const userCart = user.carts;
        res.locals.user = user;
        next();
      }
   })
  }else{
    res.locals.user = null;
    next();
  }
}

//setUser Role

function userRole(roles) {
  const token = req.cookies.jwt;
  return(req, res, next) => {
    jwt.verify(token, process.env.APP_SECRET, async (error, decodedToken) => {
      if(error) {
        console.log(error.message)
        res.locals.user = null;
        next();
      }else{
        // console.log('Decoded Info:', decodedToken);
        let user = await User.findById(decodedToken.id);

        console.log(user)
        
        if(user.roles !== roles) {
          res.status(401)
          res.alert('Not allowed ...!')
        }
        next();
      }
    }) 
  }
}



module.exports = { authenticated, checkUser };