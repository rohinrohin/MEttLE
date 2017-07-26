var express = require('express');
var router = express.Router();
var util = require('util');
var passport = require('passport');

// router.get('/', function(req, res, next) {
//   res.redirect('/login');
// });


function isAlreadyAuth (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/problems');
  } else {
    next();
  }
};


router.get('/register', function(req, res, next) {
  var messages = req.flash('error');
  res.render('register', { errorOccured: messages.length > 0, errors: messages });
});

router.post('/register', passport.authenticate('local.register', {
  successRedirect: '/problems',
  failureRedirect: '/register',
  failureFlash: true,
}));

router.get('/login', isAlreadyAuth, function(req, res, next) {
  var messages = req.flash('error');
  console.log(messages);
  res.render('login', { errorOccured: messages.length > 0, errors: messages });
})

router.post('/login', passport.authenticate('local.login', {
  successRedirect: '/problems',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/', function(req, res, next) {
  res.redirect('/login');
})

module.exports = router;
