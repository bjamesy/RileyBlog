var express    = require("express");
var router     = express.Router();
var Blog       = require("../models/blog");
var User       = require("../models/user");
var Comment    = require("../models/comment");
var middleware = require("../middleware/index.js");

//INDEX
router.get("/", function(req, res){
    Blog.find({}, function(err, foundBlogs){
        if(err){
            console.log(err);
        } else {
            res.render("blogs/index", {blogs: foundBlogs});
        }
    });
});

//NEW
router.get("/new", middleware.checkAuth, function(req, res){
    res.render("blogs/new");
    console.log(req.session);
});

//CREATE
router.post("/", middleware.checkAuth, function(req, res){
    //splice the data from the NEW form
    var title = req.body.title;
    var img = req.body.image;
    var body = req.body.body;
    var author = {
        id: req.session.Id,
        username: req.session.username
    }; 
    // create object from spliced date
    var newBlog = {title: title, image: img, body: body, author: author};
    //push newBlog into Mongo Blog array
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            req.session.sessionFlash = {
                type: 'danger',
                message: 'Failed to create new blog'
            };
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.session.sessionFlash = {
                type: 'success',
                message: 'Successful post'
            };
            res.redirect("/blogs");
        }
    });
    // res.redirect back to /blogs with new thumbnailed blog
});

// EDIT
router.get("/:id/edit", middleware.checkBlogOwner, function(req, res){
    //have data from post be within the text boxes 
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("blogs/edit", {blog: foundBlog});
        }
    });
});

// UPDATE
router.put("/:id", middleware.checkBlogOwner, function(req, res){
    //splice the data from the NEW form
    var title = req.body.title;
    var img = req.body.image;
    var body = req.body.body;
    var author = {
        id: req.session.Id,
        username: req.session.username
    };
    // create object from spliced data
    var newBlog = {title: title, image: img, body: body, author: author};

    Blog.findByIdAndUpdate(req.params.id, newBlog, function(err, updatedBlog){
        if(err){
            req.session.sessionFlash = {
                type: 'danger',
                message: 'Failed to update'
            };
            res.redirect("/blogs");
        } else {
            console.log("edited blog :)");
            req.session.sessionFlash = {
                type: 'success',
                message: 'Successfully updated'
            };
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE
router.delete("/:id", middleware.checkBlogOwner, function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
            console.log("deleted blog :)");
            req.session.sessionFlash = {
                type: 'success',
                message: 'Successfully deleted'
            };
            res.redirect("/blogs");
        }
    });
});

// SHOW
router.get("/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            console.log(foundBlog);
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

module.exports = router;