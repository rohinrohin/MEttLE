var express = require('express');
var router = express.Router();
var path = require('path');
var Question = require('../models/question');

// serve static html
router.get('/*', function (req, res, next) {
    console.log(req.user._id + " --> " + req.originalUrl);

    Question.find({
        userID: req.user._id,
        pageID: req.originalUrl
    }, null, {
        sort: {
            questionID: 1
        }
    }, function (err, result) {
        if (err || !result)  {
            res.render(req.originalUrl.slice(1), {
                hasData: false,
                answerData: null,
            });
        } else {
            console.log(result);
            var answers = [];

            result.forEach(function (answer) {
                answers.push(answer.questionData.value)
            }, this);

            res.render(req.originalUrl.slice(1), {
                hasData: false,
                answerData: answers,
            });
        }
    });

    // res.sendFile(staticFileName, {
    //   root: path.join(__dirname, '../views')
    // });
    // res.sendFile(staticFileName, { root:/ path.join(__dirname, '../views') });
});

module.exports = router;
