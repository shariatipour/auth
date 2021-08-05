const localStrategy = require("passport-local").Strategy;
const User          = require("../models/user");
const bcrypt        = require("bcryptjs");
const passport      = require("passport");

module.exports = (passport)=>{
    passport.use(new localStrategy( {usernameField:"email"} , (email , password , done) =>{
        User.findOne({email: email}, (err , user)=>{
            if (err) {
                console.log(err);
            }
            if (!user) {
                return done(null , false , {message: "No User found!"})
            }

            bcrypt.genSalt(10 , (err , salt)=>{
                bcrypt.hash(password , salt , (err , hash)=>{
                    if (err) {
                        console.log(err);
                    }
                    password = hash;
                });
            });

            bcrypt.compare(password , user.password , (err , isMatch)=>{                
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    return done(null , user);
                }else{
                    return done(null , false , {message: "wrong password!"});
                }
            });
        });
    }));

    passport.serializeUser((user , done)=>{
        done(null , user.id);
    });
    passport.deserializeUser((id , done)=>{
        User.findById(id , (err , user)=>{
            done(err , user);
        })
    })
}



