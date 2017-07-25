var express = require('express');
var router = express.Router();
var path = require('path');
var Question = require('../models/question');

router.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log("no auth");
    res.status = 200;
    req.flash('error', ['please authenticate first']);
    res.send(JSON.stringify({
      status: 'redirect',
      message: '/login'
    }));
  }
});

router.post('/problem/answer', function (req, res) {
  console.log(req.body);

  var newQuestion = {
    userID: req.user._id,
    questionID: req.body.pk,
    pageID: req.body.pageID,
    questionData: {
      value: req.body.value,
    }
  }

  Question.findOneAndUpdate({
    pageID: newQuestion.pageID,
    questionID: newQuestion.questionID,
    userID: newQuestion.userID
  }, newQuestion, {
    upsert: true,
    new: true,
    runValidators: true
  }, function (err, result) {

    if (err) {
      console.log(err);
      res.send(JSON.stringify({
        status: 'error',
        message: err
      }))
    } else {
      res.send(JSON.stringify({
        status: 'success'
      }));
    }
  });
});

module.exports = router;
