var express = require("express");
const User = require("../models/users");
var router = express.Router();
const Users = require("../models/users");
const bcrypt = require("bcrypt");
const app = require("../app");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// To register a new user render the new user
router.get("/register/new", (req, res) => {
  res.render("registeruser");
});

//create a user
router.post("/register", async function (req, res) {
  try {
    let user = await Users.create(req.body);
    console.log("This is the user created " + user);
    if (user) {
      res.send("user is created sucessfully");
    }
  } catch (err) {
    res.send(err);
  }
});

// get  the login form  to  so the user can  submit his/her detail
router.get("/login",  (req, res) => {
let notregistered = req.flash("notregistered");
let notmatched = req.flash("notmatched");
let requiredboth = req.flash("requiredboth");
let emailrequired = req.flash.emailrequired;
let passwordrequired = req.flash.passwordrequired;

res.render("usersignup", {
  noemail: notregistered,
  notmatched: notmatched,
  requiredboth: requiredboth,
  emailrequired  : emailrequired,
  passwordrequired : passwordrequired
});
});
//both required , passwordrequired , emailrequired , wrongpassword
//login a user as a admin or a normal user
router.post("/login",  async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await Users.findOne({ email });
    // if both the email  and  the password is not passed then
    if (password.length === 0 && email.length === 0) {
      req.flash("requiredboth", "email and password both are requierd ");
      return res.redirect("/users/login");
    }
    //if the email is not passed 
    if(!email){
      req.flash("emailrequired", "email is required");
      return res.redirect("/users/login");
    }

    // if the password is not passed by the user 
    if(!password){
      req.flash("passwordrequired", "password is required" );
      return res.redirect("/users/login");
    }
    // if the user is not
    //  found in the database means the user is not registered then 
    if (!user) {
      req.flash("notregistered", "user is not registered on this email");
      return res.redirect("/users/login");
    }

    let isMatched = await bcrypt.compare(req.body.password, user.password);
    // if  the password is  not matched  then
    if (!isMatched) {
      req.flash("notmatched", "password  is not matched");
      return res.redirect("/users/login");
    }
    if (isMatched) {
      req.session.userId = user.id;
      // console.log('This is the session object'+req.session.userId);
      return res.redirect("/users");
    }
    return res.redirect('/products');
  } catch (err) {
    console.log(err);
  }
});
// logout user clear the cookies on the client side as well as destroy the session on
// the server  side  so the user  session is completely removed

router.get("users/logout", async function (req, res) {
  try {
    req.session.destroy();
    req.clearCookie("connect.sid");
    res.redirect("allprodcuts");
  } catch (err) {
    // res.redirect('/users');
  }
});

// try{
//   let { email, password } = req.body;
//   // if both the password and email are not passed by the user then
//   if (!email&& !password===0) {
//     req.flash("bothrequired", "both password and email is required");
//     return res.redirect('/users/login');
//   }
//   // if the email is not passed  by the user then
//   if (!email) {
//     req.flash("emailrequired", "email is required");
//     return res.redirect('/users/login');
//   }
//   // if the password is not passed by the user
//   if (!password) {
//     req.flash("passwordrequired", "password is required");
//     return res.redirect('/users/login');
//   }

//   // Checking  the user is  a registered user or not

//   let user = await User.findOne({ email: email });
//   // if the email is not registered then thorough an error
//   if (!user) {
//     req.flash("notregistered", "user is not registered");
//     return res.redirect('/users/login');
//   }
//   //  if(!user) return console.log('user not found');
//   //  if  the user is found then match the password .
//   let isMatched = await bcrypt.compare(password, user.password);
//   //  if password not matched then it will return back to the login page with a error message
//   if (!isMatched) {
//     req.flash("wrongPassword", "password not matched please try again");
//     return res.redirect("/users/login");
//   }
//   if (isMatched) {
//     req.session.userId = user._id;
//     return res.redirect("/products");
//   }
// }
// catch(err){
//   console.log('getting an error '+err);
// }

module.exports = router;
