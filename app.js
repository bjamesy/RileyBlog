var express               = require("express"),
    app                   = express(),
    session               = require("express-session"),
    mongoose              = require("mongoose"),
    bodyParser            = require("body-parser"),
    methodOverride        = require("method-override"),  
    User                  = require("./models/user"),
    Blog                  = require("./models/blog"),
    Comment               = require("./models/comment");
    
var commentRoutes = require("./routes/comments"),
    blogRoutes    = require("./routes/blogs"),
    indexRoutes   = require("./routes/index");

mongoose.connect("mongodb://localhost/reiland_blog", { useNewUrlParser: true }); 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//*******************************************
// SESSIONS CONFIG
// ******************************************

app.use(session({
    secret: "Riley likes mens butts",
    resave: false, 
    // if true would save to sessions after each request
    saveUninitialized: false
    // if true would save to session storage dispite being uninitialized
}));

app.use(function(req, res, next) {
    // flash session configuration
    // https://gist.github.com/brianmacarthur/a4e3e0093d368aa8e423
    res.locals.sessionFlash = req.session.sessionFlash;
    // if there's a flash message in the session request, make it available in the response, then delete it
    delete req.session.sessionFlash;
    next();
});

app.use(function(req, res, next) {
    // express session object 
    res.locals.currentUser = req.session;
    next();
});

// ***** REFACTORED ROUTES ******

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

// ***** LISTENER ******

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("your server has started!");
});