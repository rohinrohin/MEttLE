var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var hbs = require('hbs');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require("express-flash");

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/mettle', {
  useMongoClient: true,
});

require('./config/passport.js');

var login = require('./routes/login');
var custom = require('./routes/custom');
var api = require('./routes/api');
var static = require('./routes/static');
var problem = require('./routes/problem');

var app = express();

app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: 'METTLESECRET',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'views')));

app.use('/', login);
app.use('/api', api);

app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'please authenticate first');
    res.redirect('/login');
  }
});
app.use('/problem/1/', problem);
app.use('/', custom);
app.use('/', static); // static html routing.

// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
