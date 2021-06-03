const jwt = require("jsonwebtoken");


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

module.exports = authenticated;