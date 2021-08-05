const User     = require("../models/user");
const jwt      = require("jsonwebtoken");
const mailgun  = require("mailgun-js");
const { body } = require("express-validator/check");
const bcrypt   = require("bcryptjs");

const JWT_ACC_ACTIVATE = 'sm' ;

exports.isUser = (req , res , next)=>{
    if (req.isAuthenticated()) {
        next();
    }else{
        res.status(500).json({message:"Please Log in first!"});
    }
};
exports.isAdmin = (req , res , next)=>{
    if (req.isAuthenticated() && res.locals.user.admin == 1) {
        next();
    }else{
        res.status(500).json({message:"Please Log in as Admin!"});
    }
};
exports.signup = (req , res )=>{
    console.log("req.body:" , req.body);
    var {name , username , email , password , password2} = req.body;
    req.checkBody("name" , "Name is required!").notEmpty();
    req.checkBody("username" , "Username is required!").notEmpty();
    req.checkBody("email" , "email is required!").isEmail();
    req.checkBody("password" , "Password is required!").notEmpty();
    req.checkBody("password2" , "Passwords do not match!").equals(password);
    var errorsValidator = req.validationErrors();
    if (errorsValidator) {
        res.status(500).json(errorsValidator)
    }else{
        User.findOne({email: email} , (err , user)=>{
            if(user){
                res.status(400).json({message:"User already exist!"});
            }
            const token = jwt.sign({name , email , username , password} , JWT_ACC_ACTIVATE , {expiresIn:'20m'});
               console.log("token:",token) 
               if (token != 'undefined' && token !== "") {
                res.status(200).json(token)

               }else{
                   res.status(500).json({message:'token not created!'})
               }    
            }    
        )}
};
exports.getActiveAcount = (req , res)=>{
    const token = req.params.token;
    res.status(200).json(token);
};
exports.postActiveAcount = (req , res)=>{
    const token = req.params.token;
    if (token) {
        jwt.verify(token , JWT_ACC_ACTIVATE , (err , decodedToken)=>{
            if (err) {
                res.status(408).json({message:"token not decoded!"})
            }else{
                const {name , email , username , password} = decodedToken;
                var user = new User({name, username, email, password, admin: 0});
                bcrypt.genSalt(10 , (err , salt)=>{
                    bcrypt.hash(user.password , salt , (err , hash)=>{
                        if (err) {
                            console.log(err);
                        }
                        user.password = hash;
                        user.save(err=>{
                            if (err) {
                                console.log(err);
                            }else{
                                res.status(200).json({message:"account activated!"})
                            }
                        });
                    })
                })
            }
        })
    }else{
        res.status(401).json("not activated!")
    }
};
exports.getCallbackLogin = (req , res)=>{
    if (req.user) { res.send(req.user); }
        else { res.send(401); }
};
exports.postLogin = (req , res , next)=>{
    passport.authenticate("local");
    if (passport.isAuthenticated()) {
        return res.status(200).json({message:"Loged in!"});
        }else{
        res.status(500).json({message:"not Loged in!"});
    }(req , res , next)
};
exports.logout = (req , res)=>{
    req.logout();
    res.status(200).json({message:"logged out!"});
};
exports.updatToken = (req , res)=>{
    const {email} = req.body;
    User.findOne({email: email} , (err , user)=>{
        if (!user) {
            return res.status(404).json({message:'User not Exist!'});
        }
        const token = jwt.sign({_id: user._id} , process.env.RESET_PASSWORD_KEY , {expiresIn: '20m'});
        console.log("token:",token);
        if (token != 'undefined' && token !== "") {
            res.status(200).json(token)
        }else{
            res.status(500).json({message:'token not created!'})
        } 
        user.resetLink = token;
        user.save(err=>{
            if (err) {
                console.log(err);
            }else{
                res.status(200).json({message:"new token saved!"});
            }
        });
    })
};
exports.getNewToken=(req , res)=>{
    var resetLink = req.params.resetLink;
    res.status(200).json(resetLink);
};
 exports.setNewPass = (req , res)=>{
    var resetLink = req.params.resetLink;
    var password  = req.body.password;
    var password2 = req.body.password2;
    req.checkBody("password" , "Password is required!").notEmpty();
    req.checkBody("password2" , "Passwords do not match!").equals(password);
    var errorsValidator = req.validationErrors();
    if (errorsValidator) {
        res.status(500).json(errorsValidator)
    }else{
        User.findOne({resetLink:resetLink} , (err, user)=>{
            if(!user){
                res.status(404).json({message:"User not found!"});
            }
            user.password = password;
            bcrypt.genSalt(10 , (err , salt)=>{
                bcrypt.hash(user.password , salt , (err , hash)=>{
                    if (err) {
                        console.log(err);
                    }
                    user.password = hash;
                    user.save(err=>{
                        if (err) {
                            console.log(err);
                        }else{
                            res.status(200).json({message:"Password now updated!now Log in."})
                        }
                    });
                });
            });
        })
    }
 };