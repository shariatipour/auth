const express  = require("express");
const router            = express.Router();
const passport          = require("passport");
const auth              = require("../configs/auth");
const jwt               = require("jsonwebtoken");
const { body }          = require("express-validator/check");
const signup            = auth.signup;
const updatToken        = auth.updatToken;
const getNewToken       = auth.getNewToken;
const getActiveAcount   = auth.getActiveAcount;
const postActiveAcount  = auth.postActiveAcount;
const postLogin         = auth.postLogin;
const getCallbackLogin  = auth.getCallbackLogin;
const logout            = auth.logout;
const setNewPass        = auth.setNewPass;

router.post("/register" , signup);
router.get("/active-account/:token", getActiveAcount);
router.post("/active-account/:token" ,postActiveAcount);
router.post("/login" , postLogin);
router.get('/login/callback', passport.authenticate('local'), getCallbackLogin);
router.get("/logout" , logout);
router.put("/forgot-password" ,updatToken);
router.get("/forgot-password/:resetLink" , getNewToken);
router.post("/forgot-password/:resetLink" , setNewPass);

module.exports = router ;
