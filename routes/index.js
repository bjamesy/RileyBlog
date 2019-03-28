var express    = require("express");
var router     = express.Router();
var Blog       = require("../models/blog");
var User       = require("../models/user");
var Comment    = require("../models/comment");
var middleware = require("../middleware/index.js");

//ROOT
router.get("/", function(req, res){
    res.render("index");
});

//LOGIN
router.get("/login", function(req, res){
    res.render("login");
});

//handle LOGIN logic
router.post("/login", middleware.checkSignIn, function(req, res){
    // login being done in the middleware
    req.session.sessionFlash = {
        type: 'success',
        message: 'Logged in'
    };
    res.redirect("blogs");
    res.end();
});

//REGISTER
router.get("/register", function(req, res){
    res.render("register");
});

//handle REGISTER logic
router.post("/register", function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    
    var newUser = {username: username, password: password};
    User.create(newUser, function(err, createdUser){
        if(err){
            req.session.sessionFlash = {
                type: 'danger',
                message: 'Failed to register'
            };
            console.log(err);
            res.redirect("/blogs");
        } else {
            req.session.sessionFlash = {
                type: 'success',
                message: 'Successfully registered'
            };
            console.log("added new user :)");
            res.redirect("/login");
        }
    });
});

//LOGOUT
router.get("/logout", function(req, res){
    // req.session.destroy(function(err){
    // ^^^^ didnt work becase flash message was unable to be attributed to null or undefined and therefore not 
    req.session.regenerate(function(err){
        if(err){
            console.log(err);
        } else {
            console.log("signed out bitch!");
            req.session.sessionFlash = {
                type: 'success',
                message: 'Logged out'
            };
            res.redirect("blogs");
        }
    });
});

module.exports = router;