const { application } = require('express');
const mongoose  = require('mongoose');

let articleSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    description : {
        type : String
    },
    likes :{
        type : Number,
        default : 0
    },
    comments :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    author : {
        type : String 
    },
    slug: { type: String, slug: "title" }
})

// Adding a slug everytime  a user adds a article in our blog application
articleSchema.pre('save' , async function(next){
    this.slug =  await this.title.split(' ').join('-');
    return next();
})

let Article  =  mongoose.model('Article',articleSchema);
module.exports = Article;