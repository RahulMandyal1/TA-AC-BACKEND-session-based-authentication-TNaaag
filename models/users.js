const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
let userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  city: {
    type: String,
  },
});
// Hashing the user password
userSchema.pre('save' , async function(next){
  if(this.password && this.isModified('password')){
     this.password= await bcrypt.hash(this.password ,10);
     //  console.log('Hased  password is :'+this.password);
     console.log("This is completely hashed " + this);
       return next();
  }
  next();
});
let User = mongoose.model("User", userSchema);
module.exports = User;
