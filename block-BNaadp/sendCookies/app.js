var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//adding the cookies parser as a middelware so we can  and send the cookies 
app.use(cookieParser());
app.use((req ,res,next)=>{
  res.cookie('name' ,"Rahul thakur");
  next(); 
});
// sending the  cookies on the user browsers 
//when a user request on any route rightnow the cookie will also be passed in the 
//req route because client already has that cookie in his browser so we are jsut 
//accessing here 
app.use('/' ,(req ,res)=>{
  console.log('The name of the user is :'+req.cookie.name);
  res.send('username is '+req.cookie.name);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
