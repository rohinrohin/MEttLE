var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/logout', function(req, res, next) {
    console.log("logging out");
    req.logOut();
    res.redirect('/');
});


module.exports = router;
