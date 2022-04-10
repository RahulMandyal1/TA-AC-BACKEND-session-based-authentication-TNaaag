const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Products = require("../models/product");
const User = require("../models/users");

const uploadPath = path.join(__dirname, "../public/uploads/");
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
router.get("/", async (req, res) => {
  try {
    let userId = req.session.userId;
    let isRegistered = true;
    let isAdmin = false;
    // if the user is not isRegistered
    if (!userId) {
      isAdmin = false;
      isRegistered = false;
    }
    // if the user is is isRegistered then check for  the user is a admin or not
    if (isRegistered === true) {
      let user = await User.findById(userId);
      if (user.isadmin === true) {
        isAdmin = true;
      }
    }
    let allproducts = await Products.find({});
    return res.render("products", {
      products: allproducts,
      isAdmin: isAdmin,
      isRegistered: isRegistered,
    });
  } catch (err) {
    return res.redirect("/");
  }
});

// only  logged in admin user can add a product
router.get("/new", async (req, res) => {
  try {
    // to check weather the user  admin or not if admin then only he will able to
    // open that  form to add a new product
    let userid = req.session.userId;
    let user = await User.findById(userid);
    if (user.isadmin === true) {
      return res.render("addproduct");
    }
    return res.render("users/login");
  } catch (err) {
    return res.redirect("/products");
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    req.body.image = req.file.filename;
    let product = await Products.create(req.body);
    res.redirect("/products");
  } catch (err) {
    res.redirect("/products/new");
  }
});

// edit a product
router.get("/edit/:id", async (req, res) => {
  try {
    // checking if the user is admin then only move forward
    let id = req.params.id;
    let userid = req.session.userId;
    let user = await User.findById(userid);
    if (user.isadmin === true) {
      let product = await Products.findById(id);
      res.render("editproduct", { product: product });
    }
    return res.redirect("/users/login");
  } catch (err) {
    res.redirect("/products");
  }
});
// now edit  the product
router.post("/:id", upload.single("image"), async (req, res) => {
  try {
    console.log("coming inside the products to edit  this product");
    let id = req.params.id;
    req.body.image = req.file.filename;
    let product = await Products.findByIdAndUpdate(id, req.body, { new: true });
    console.log("we are here updating  the products" + product);
    res.redirect("/products");
  } catch (err) {
    res.redirect("/products");
  }
});

// delete the product  only author can delete it
router.get("/:id/delete", async (req, res) => {
  try {
    let id = req.params.id;
    let userid = req.session.userId;
    let user = await User.findById(userid);
    //checking if the user is admin then only the user can move forward
    if (user.isadmin === true) {
      let product = await Products.findByIdAndDelete(id);
      return res.redirect("/products");
    }
    res.redirect("/products");
  } catch (err) {
    res.redirect("/products");
  }
});

// like the product only user can like the product
router.get("/:id/like", async (req, res) => {
  try {
    let id = req.params.id;
    let userid = req.session.userId;
    let user = await User.findById(userid);
    if (user.isadmin === true) {
      let product = await Products.findByIdAndUpdate(id, {
        $inc: { likes: +1 },
      });
      return res.redirect("/products");
    }
    res.redirect("/products");
  } catch (err) {
    res.redirect("/users/login");
  }
});

//dislike the product
router.get("/:id/dislike", async (req, res) => {
  try {
    let id = req.params.id;
    let userid = req.session.userId;
    let user = await User.findById(userid);
    if (user.isadmin === ture) {
      let product = await Products.findById(id);
      if (product.likes > 0) {
        let product = await Products.findByIdAndUpdate(id, {
          $inc: { likes: -1 },
        });
        return res.redirect("/products");
      }
      res.redirect("/products");
    }
    res.redirect("/user/login");
  } catch (err) {
    res.redirect("/products");
  }
});

module.exports = router;
