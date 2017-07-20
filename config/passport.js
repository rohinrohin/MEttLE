var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
let ADMIN_KEY = '1234';

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  })
});

passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password (min three char)').notEmpty().isLength({min: 3});

  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({
    'email': email,
  }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'No user found, please register'
      });
    }
    if (!user.checkPassword(password)) {
      return done(null, false, {
        message: 'Incorrect Password'
      })
    }
    return done(null, user);
  });
}));

passport.use('local.register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password (min three char)').notEmpty().isLength({min: 3});
  req.checkBody('passwordConfirm', 'Passwords must match').equals(req.body.password);
  req.checkBody('adminKey', ' Admin Key mismatch, contact admin').notEmpty().equals(ADMIN_KEY);

  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({
    'email': email
  }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
        return done(null, false, {
        message: 'Email is already in use'
      });
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.save(function (err, result) {
      if (err) {
        return done(err);
      } else {
        done(null, newUser);
      }
    });
  });
}));
