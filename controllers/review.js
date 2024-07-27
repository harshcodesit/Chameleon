const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");



//review create

module.exports.Creview = async (req,res)=>{
    let {id}= req.params;
    let reviewed = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    // newReview.author = req.user._id;
    // console.log(newReview);
    // res.redirect("/listings");
   newReview.author = req.user._id;
   console.log(newReview.author);
    reviewed.reviews.push(newReview);
    await newReview.save();
    await reviewed.save();
    res.redirect(`/listings/${id}`)
}


// Dlete review
module.exports.Dreview =  async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    res.redirect(`/listings/${id}`);
   }