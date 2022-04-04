var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/user');

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('registeruser');
});


router.post('/register', function(req, res, next) {
  Users.create(req.body ,(err ,user)=>{
    if(err) return res.redirect('/users/register');
    console.log('this is the enterened document'+user);
  })
});

module.exports = router;
