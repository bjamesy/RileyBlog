var User       = require("../models/user");
var Blog       = require("../models/blog");
var Comment    = require("../models/comment");
var middleware = {};

// *****************using bcrypt to hash passwords********************
middleware.checkSignIn = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne({username : username}, function(err, foundUser){
        if(err || !foundUser){
            req.session.sessionFlash = {
                    type: 'danger',
                    message: 'Oops! Incorrect username'
                };
            console.log(err);
            console.log("theres no one by that username !");
            res.redirect("login");
        } else {
            foundUser.comparePassword(password, function(err, isMatch){
                console.log(isMatch);
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else if (isMatch && isMatch == true){
                    req.session.username = foundUser.username;
                    req.session.password = foundUser.password;
                    req.session.Id       = foundUser._id;
                    req.session.sessionFlash = {
                            type: 'success',
                            message: 'Logged in'
                    };
                    next();
                } else {
                    req.session.sessionFlash = {
                            type: 'danger',
                            message: 'Oops! Incorrect password'
                        };
                    console.log("unauthorized bitch!");
                    res.redirect("login");
                }
            });
        }
    });    
};    

middleware.checkAuth = function(req, res, next){
    if(req.session.username){
        console.log("ok bish thats allowed");
        next();
    } else {
        req.session.sessionFlash = {
            type: 'danger',
            message: 'Oops! Have to be logged in to do that'
        };
        res.redirect("/login");
    }
};

middleware.checkCommentOwner = function(req, res, next){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else if(foundComment.author.id.equals(req.session.Id)){
                console.log("nice ur allowed for that comment");
                next();
        } else {
            console.log("thats not your comment to edit");
            req.session.sessionFlash = {
                type: 'danger',
                message: 'Oops! Need permission to do that'
            };            
            // something other than "back to redirect to here maybe ????" ****************
            res.redirect("back");
        }
    });
};

middleware.checkBlogOwner = function(req, res, next){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("back");
        } else if(foundBlog.author.id.equals(req.session.Id)){
            console.log("u can do that to that blog ok");
            next();
        } else {
            console.log("thats not your blog to edit");
            req.session.sessionFlash = {
                type: 'danger',
                message: 'Oops! Need permission to do that'
            };
            // something other than "back to redirect to here maybe ????" ****************
            res.redirect("back");
        }
    });
};

module.exports = middleware;

// *****************unencrypted passwords middelware******************
// var checkSignIn = function(req, res, next){
//     User.findOne({username : req.body.username}, function(err, foundUser){
//         // { $or: [ {'username' : username} ] }
//         if(err){
//             console.log(err);
//             res.redirect("back");
//         } else {
//             console.log(foundUser);
//             var user = foundUser.username === req.body.username;
//             var pass = foundUser.password === req.body.password;
//             console.log(user);
//             console.log(pass);
//             if(user && pass){
//                 console.log("signed in bish");
//                 req.session.username = foundUser.username;
//                 req.session.password = foundUser.password;
//                 req.session.Id       = foundUser._id;
//                 return next(); 
//             } else {
//                 console.log("ur not permitted to sign in bish!");
//                 res.redirect("back");
//             }
//         }
//     });
// };    

// ***************** query search from checkAuth - removed to lessen load of n extra db call **************
//     User.findOne({username : req.session.username}, function(err, authUser){
//         if(err || !authUser){
//             console.log(err);
//             req.session.sessionFlash = {
//                 type: 'danger',
//                 message: 'Oops! Have to be logged in to do that'
//             };
//             res.redirect("/login");
//         } else {
//             var user = req.session.username === authUser.username;
//             var pass = req.session.password === authUser.password;
//             if(user && pass){
//                 console.log("ok bish thats allowed");
//                 return next();
//             }
//         }
//     });
