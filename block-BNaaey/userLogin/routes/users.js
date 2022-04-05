var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Users = require("../models/user");
const bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/', (req ,res)=>{
  console.log(req.session);
  res.send('user is logged in sucessfully');
})

router.get("/register", function (req, res, next) {
  res.render("registeruser");
});

router.post("/register", function (req, res, next) {
  Users.create(req.body, (err, user) => {
    if (err) return res.redirect("/users/register");
    console.log("this is the enterened document" + user);
  });
});

// list a form to a user to enter his Credential details
router.get("/login", (req, res) => {
  res.render("userlogin");
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.redirect("/users/login");
    }
    let user = await Users.findOne({ email });
    // if the email is not available in the database then it will be redirectd to the login page again 
    if(!user){
      return res.redirect('/users/login');
    }
    let  isMatched = await  bcrypt.compare(req.body.password  , user.password);
    // if  the password is mathed then user is redirected to the dashboard
    if(isMatched){
      req.session.userId = user.id;
      return res.redirect('/users');
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
