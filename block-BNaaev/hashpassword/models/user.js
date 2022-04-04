const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let userSchema = mongoose.Schema({
    name : {
        type :String,
        required : true
    },
    email : String,
    password : {
        type : String ,
        min : 5,
    },
    age :{
        type : Number,
        default :18
    },
    phone :Number
})
 userSchema.pre('save' , async function(next){
     this.password= await bcrypt.hash(this.password ,10);
    //  console.log('Hased  password is :'+this.password);
     next();
 });
const User  = mongoose.model('User',userSchema);
module.exports = User;

