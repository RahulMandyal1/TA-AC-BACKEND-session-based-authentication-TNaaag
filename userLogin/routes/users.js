var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const app = require("../app");

/* GET users listing. */
// if the user is successfully registered then show this page
router.get("/", (req, res) => {
  let { userId: id } = req.session;
  console.log(`Getting  the session object user id is :${id}`);
  res.render("users");
});

// get a form to resiter user
router.get("/register", function (req, res, next) {
  let minimumfour = req.flash("minimumfour");
  res.render("registeruser", { minimumlength: minimumfour });
});

// enter  the data in the database with  the password already converted into hased format
// with the help of pree hooks in the model schema
router.post("/register", function (req, res, next) {
  if (req.body.password.length <= 4) {
    req.flash("minimumfour", "length must be greater than four words");
    res.redirect("users/register");
  }
  Users.create(req.body, (err, user) => {
    if (err) return res.redirect("/users/register");
    console.log(user);
    res.redirect("/login");
  });
});

// list a form to a user to enter his Credential details
router.get("/login", (req, res) => {
  let notregistered = req.flash("notregistered");
  let notmatched = req.flash("notmatched");
  let requiredboth = req.flash("requiredboth");
  res.render("userlogin", {
    noemail: notregistered,
    notmatched: notmatched,
    requiredboth: requiredboth,
  });
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    // if (!email || !password) {
    //   return res.redirect("/users/login");
    // }
    let user = await Users.findOne({ email });
    // if the email is not available in the database then it will be redirectd to the login page again
    if (password.length === 0 && email.length === 0) {
      console.log("length is null");
      req.flash("requiredboth", "email and password both are requierd ");
      return res.redirect("/users/login");
    }
    if (!user) {
      req.flash("notregistered", "email is not Registered");
      return res.redirect("/users/login");
    }
    let isMatched = await bcrypt.compare(req.body.password, user.password);
    // if  the password is mathed then user is redirected to the dashboard
    if (!isMatched) {
      req.flash("notmatched", "password  is not matched");
      return res.redirect("/users/login");
    }
    if (isMatched) {
      req.session.userId = user.id;
      // console.log('This is the session object'+req.session.userId);
      return res.redirect("/users");
    }
  } catch (err) {
    console.log(err);
  }
});

// logout user 
router.get('/logout' ,(req ,res)=>{
  req.session.destroy();
  // res.clearCookie(connect.sid);
  res.redirect('/users/login');
})

module.exports = router;
