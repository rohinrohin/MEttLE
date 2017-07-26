var express = require('express');
var router = express.Router();
var Log = require('../models/log');

router.get('/', function (req, res, next) {
  res.render('log-viewer');
});

router.post('/', function (req, res, next) {
  Log.find({
    "meta.user": req.body.userEmail
  }).sort({timestamp: -1}).exec(function (err, result) {
    if (err || !result) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(result));
    }
  });
});

module.exports = router;
