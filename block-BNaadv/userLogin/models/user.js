const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let userSchema = mongoose.Schema({
    name : {
        type :String,
        required : true
    },
    email :{
        type : String,
        unique : true
    },
    password : {
        type : String ,
        min : 5,
    },
})
 userSchema.pre('save' , async function(next){
     if(this.password && this.isModified('password')){
        this.password= await bcrypt.hash(this.password ,10);
        //  console.log('Hased  password is :'+this.password);
        console.log("This is completely hashed " + this);
          return next();
     }
     next();
 });



const User  = mongoose.model('User',userSchema);
module.exports = User;

