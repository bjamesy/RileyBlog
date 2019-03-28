var mongoose         = require("mongoose");
var Schema           = mongoose.Schema;
var bcrypt           = require("bcrypt"),
    SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
    username: String,
    password: String
});

// from hhtp://stackoverflow.com/questions/14588032/mongoose-password-hashing
userSchema.pre("save", function(next){
    var user = this;
    // only hash the password if it has been modified or is new
    if(!user.isModified('password')){
        console.log("hi");
        return next();
    } else {
        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
            if(err){
                return next(err);
            } else {
                // hash the password using our new salt 
                bcrypt.hash(user.password, salt, function(err, hash){
                    if(err){
                        return next(err);
                    } else {
                        // override the cleartext password with the hashed one 
                        user.password = hash;
                        console.log(salt);
                        console.log(hash);
                        next();
                    }
                });
            }
        });
    }
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err){
            return callback(err);
        } else {
            callback(undefined, isMatch);
        }
    });
};

var User       = mongoose.model("User", userSchema);
module.exports = User;

// var newUser = new User({
//     username: "Reiland",
//     password: "urgay"
// });
// newUser.save(function(err, user){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });