const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const router = express.Router();
let Article = require("../models/article");
let Comment = require("../models/comments");
router.get("/new", (req, res) => {
    console.log(req.session.userId);
  if(req.session.userId){
    res.render("addarticle");
  }
  let loginerror = req.flash('loginerror','You need to login to add a new article')
});

router.get("/", async (req, res) => {
  try {
    let allArticles = await Article.find({});
    res.render("articles", { articles: allArticles });
  } catch (err) {
    res.statusCode(404).redirect("/articles/new");
  }
});

// post a articles and redirect to all the articles page
router.post("/", async (req, res, next) => {
  try {
    let createdArticle = await Article.create(req.body);
    if (createdArticle) {
      res.redirect("/articles");
    }
  } catch (err) {
    res.redirect("/article/new");
  }
});

//get a article  detailed article by a single artilce id
router.get("/:slug", async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let article = await Article.findOne({ slug: slug }).populate('comments');
    if (article) {
      res.render("detailedArticle", { article: article });
    }
  } catch (err) {
    // console.log("Got an error inside  the get a single article page ");
    res.redirect("/articles");
  }
});

// /articles/<%=article.slug%>/comment

router.post("/:id/:slug/comment", async (req, res) => {
  let id = req.params.id;
  let slug = req.params.slug;
  try {
    req.body.articleId = id;
    let comment = await Comment.create(req.body);
    let updatedcommentInArticle = await Article.findByIdAndUpdate(id, {
      $push: { comments: comment._id },
    });
    res.redirect('/articles/'+slug);
  } catch (err) {
    res.redirect("/articles/" + slug);
  }
});


// adding  the like functionality here 
// articles/<%=article.slug%>/like
router.get("/:slug/like", (req, res, next) => {
    let slug = req.params.slug;
    console.log('get a request to updaed this article');
    Article.findOneAndUpdate(
      {slug : slug},
      { $inc: { likes: 1 } },
      { new: true },
      (err, article) => {
        if (err) return next(err);
        console.log("This is the updated article " + article);
        res.redirect(`/articles/${slug}`);
      }
    );
  });

//   dislike  the article 
router.get("/:slug/dislike",  async(req, res) => {
    let slug = req.params.slug;
    try{
        let  article = await Article.findOne({slug  : slug});
        if(article.likes  > 0){
        let decreseLike = await Article.findByIdAndUpdate(article._id ,{$inc :{likes : -1}},{new : true});
        console.log(decreseLike);
        res.redirect('/articles/'+slug);
        }
        res.redirect('/articles/'+slug);
    }
    catch(err){
        res.redirect('/articles/'+slug);
    }
})



    
module.exports = router;
