const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const productsRouter = require('./admin/routes/products')
const userRouter = require('./admin/routes/users')
const orderRouter = require('./admin/routes/orders')
const categoryRouter = require('./admin/routes/categories')
const authRouter = require('./admin/routes/auth')

const app = express();

// Kết nối với MongoDB
mongoose.connect('mongodb://localhost/Web_ban_Laptop');

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'admin/views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/products', productsRouter);
app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/categories', categoryRouter);
app.use('/auth', authRouter);

//Thanh điều hướng
// app.get('/', (req, res) => {
//   res.redirect('/auth/login'); // Chuyển hướng đến trang login
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
