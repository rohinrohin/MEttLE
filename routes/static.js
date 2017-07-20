var express = require('express');
var router = express.Router();
var path = require('path');


router.use(function (req, res, next) {
if (req.isAuthenticated()) {
  next();
} else {
  messages = ['authenticate first', 'authenticate first'];
  req.flash('error', 'Flash is bacckkkk!');
  return res.redirect('/login');
}});

// serve static html
router.get('/*', function (req, res, next) {
staticFileName = req.originalUrl + '.html';
console.log("got static html: " + staticFileName);
res.sendFile(staticFileName, {
  root: path.join(__dirname, '../views')
});
// res.sendFile(staticFileName, { root:/ path.join(__dirname, '../views') });
});

module.exports = router;
