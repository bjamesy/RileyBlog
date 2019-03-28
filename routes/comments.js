var express    = require("express");
var router     = express.Router({mergeParams: true});
var Blog       = require("../models/blog");
var User       = require("../models/user");
var Comment    = require("../models/comment");
var middleware = require("../middleware/index.js");

// GET route
router.get("/new", middleware.checkAuth, function(req, res){
        Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            req.session.sessionFlash = {
                type: 'danger',
                message: 'Oops! Something went wrong'
            };
            res.redirect("back");
        } else {
            console.log("made it this far");
            console.log(foundBlog);
            res.render("comments/new", {blog: foundBlog});
        }
    });
});

// POST
router.post("/", middleware.checkAuth, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
            console.log(err);
            req.session.sessionFlash = {
                type: 'danger',
                message: 'Oops! Something went wrong'
            };
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    req.session.sessionFlash = {
                        type: 'danger',
                        message: 'Failed to create new comment'
                    };
                    // res.redirect("back");
                } else {
                    //adding id and username to comment 
                    comment.author.id       = req.session.Id;
                    comment.author.username = req.session.username;
                    //save comment
                    comment.save();
                    console.log(comment);
                    foundBlog.comments.push(comment);
                    //save blog with comment added 
                    foundBlog.save();
                    console.log(foundBlog.comments);
                    req.session.sessionFlash = {
                        type: 'success',
                        message: 'Added comment'
                    };
                    res.redirect("/blogs/" + foundBlog._id);
                }
            });
        }
    });
});

// EDIT 
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
    // findById Comment
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            console.log(foundComment);
            res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE comment
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
    // findByyIdAndUpdate comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            req.session.sessionFlash = {
                type: 'danger',
                message: 'Failed to update comment'
            };
            res.redirect("back");
        } else {
            console.log(updatedComment);
            req.session.sessionFlash = {
                type: 'success',
                message: 'Updated comment'
            };
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
    // findByyIdAndRemove comment
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            req.session.sessionFlash = {
                type: 'danger',
                message: 'Failed to delete comment'
            };
            res.redirect("back");
        } else {
            req.session.sessionFlash = {
                type: 'success',
                message: 'Deleted comment'
            };
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;