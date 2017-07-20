var express = require('express');
var router = express.Router();
var path = require('path');




// serve static html
router.get('/*', function (req, res, next) {
  staticFileName = req.originalUrl + '.html';
  console.log("got static html: " + staticFileName);

  res.sendFile(staticFileName, {
    root: path.join(__dirname, '../views')
  });
});

module.exports = router;
