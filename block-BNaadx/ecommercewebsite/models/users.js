const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  isadmin: {
    type: Boolean
  },
});
userSchema.pre("save", async function (next) {
    console.log("This is a pre save "+this);
//   //all the admin user emails are
  let adminusers = [
    "rahulmandyal079@gmail.com",
    "example@gmail.com",
    "unknown@gmail.com",
    "usermeet@gmail.com",
  ];
  //   if  the user  email is one of these emails then the  user is a admin
  // if the user email does not match  with  these emails then the user is not a admin
  if (adminusers.includes(this.email)) {
    this.isadmin = true;
  } else {
    this.isadmin = false;
  }
  //   hashing the password here
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
