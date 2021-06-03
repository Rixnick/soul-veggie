const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
// const session = require('express-session');


// import Routes
const AuthRoute = require('./routes/authRoute');
const CateRoute = require('./routes/cateRoute');
const VillageRoute = require('./routes/villageRoute');
const VegetableRoute = require('./routes/vegetableRoute');
const SellerRoute = require('./routes/sellerRoute');
const SaleRoute = require('./routes/saleRoute');


//client Routes
const ClientRoute = require('./routes/clientRoute');

//Connect to Database
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function () {
  console.log('Connected To Mongo DB...!')
})

//Initialization App
const app = express();

//Use Cors to promisse multer method overide
//Middleware config
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../', 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '../', 'temp'),
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 },
}));

//Setup Static Folder





//Used Routes
app.use('/user', AuthRoute);
app.use('/category', CateRoute);
app.use('/village', VillageRoute);
app.use('/vegetable', VegetableRoute);
app.use('/seller', SellerRoute);
app.use('/sales', SaleRoute);


//Client
app.use('/', ClientRoute)





module.exports = app;