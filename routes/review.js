const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const reviewCont= require("../controllers/review");
const isloggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.directed = req.originalUrl;
        req.flash("error", "You must be loged in first");
        
        return res.redirect("/user/login");

    }
    next();
}
const isAuthor = async (req,res,next)=>{
    let {id} = req.params;
let {reviewId} = req.params;
let review = await Review.findById(reviewId);

 if(!review.author.equals(res.locals.currUser.id)){ 
    req.flash("error", " you are not the author of the review");
    return res.redirect(`/listings/${id}`);
}
next();
}

//review create
router.post("/:id/review",isloggedIn,wrapAsync(reviewCont.Creview));

router.delete("/:id/review/:reviewId",isloggedIn,isAuthor,reviewCont.Dreview);


   
module.exports = router;