const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const userCont= require("../controllers/user");

const url = (req,res,next)=>{
    if(!req.session.directed){
    req.session.directed = "/listings";}
    if(req.session.directed){
        
        res.locals.directed = req.session.directed;
    }
    next();
}


router.route("/signup")
.get((req,res)=>{
    res.render("user/signup.ejs")
})
.post(userCont.signup);


router.route("/login")
.get((req,res)=>{
    res.render("user/login.ejs")
})
.post(url,passport.authenticate("local",{failureRedirect: "/user/login",failureFlash: true}),userCont.login);


//logout 
router.get("/logout",userCont.logOut);






module.exports = router;