const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Products = require("../models/product");
const { findByIdAndUpdate } = require("../models/product");

const uploadPath = path.join(__dirname , "../public/uploads/");
console.log(uploadPath);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//get  the all products  page once the user is login  or the user is a admin
// both admin and normal user can access this page
router.get("/",  async(req, res) => {
  try{    
    let allproducts = await Products.find({});
    res.render('products',{products : allproducts});
  }
  catch(err){
    res.redirect('/products');
  }
});

// only  logged in admin user can add a product
router.get("/new", (req, res) => {
  res.render('addproduct');
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    req.body.image = req.file.filename;
    let product = await Products.create(req.body);
    res.redirect('/products');
  } catch (err) {
      res.redirect('/products/new')
  }
});

// edit a product 
router.get('/edit/:id' , async(req ,res)=>{
  try{
    let id = req.params.id;
    let product = await Products.findById(id);
    res.render('editproduct',{product : product});
  }
  catch(err){
    res.redirect('/products')
  }
})
// now edit  the product  
router.post("/:id", upload.single("image"), async (req, res) => {
  try {
    console.log('coming inside the products to edit  this product');
    let id = req.params.id;
    req.body.image = req.file.filename;
    let product =  await Products.findByIdAndUpdate(id ,req.body , {new :true});
    console.log("we are here updating  the products"+product);
    res.redirect('/products');
  } catch (err) {
      res.redirect('/products')
  }
});

// delete the product  only author can delete it 
router.post("/:id",  async (req, res) => {
  try {
    let id = req.params.id;
    let product =  await Products.findOneAndDelete(id);
    res.redirect('/products');
  } catch (err) {
      res.redirect('/products')
  }
});

// like the product only user can like the product
router.post("/:id/like",  async (req, res) => {
  try {
    let id = req.params.id;
    let product =  await Products.findByIdAndUpdate(id ,{$inc : {likes : +1}});
    res.redirect('/products');
  } catch (err) {
      res.redirect('/products')
  }
});

//dislike the product 
router.post("/:id/dislike",  async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Products.findById(id);
    if(product.likes>0){
      let product =  await Products.findByIdAndUpdate(id ,{$inc : {likes : -1}});        
     return res.redirect('/products');
    }
    res.redirect('/products');
  } catch (err) {
      res.redirect('/products')
  }
});
module.exports = router;
