const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const directed = require("../routes/listing");


module.exports.signup = async(req,res)=>{
    try{
     let {username, email, password}= req.body;
     const user1 = new User({email,username});
     const registerUser = await User.register(user1,password);
     console.log(registerUser);
    
     req.login(registerUser, (err)=>{
         if(err){
             return next(err);
         }
         req.flash("success", `Welcome ${username} to Camelon`);
         res.redirect("/listings");
      });
    }catch(err){
   req.flash("error", err.message);
   res.redirect("/user/signup")
    }
 }

 //login

 module.exports.login = (req,res)=>{
    let {username}= req.body;
    req.flash("success", `Great Having You Back! ${username}`);
    if(res.locals.directedURL){
    res.redirect( res.locals.directedURL)}


    res.redirect("/listings");

}

//logout
module.exports.logOut =(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
            req.flash("success", "Logged out..  hope you get back.");
            res.redirect("/listings");
      
    })
}   