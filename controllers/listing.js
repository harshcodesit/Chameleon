const express = require("express");
const router = express.Router(); 

const wrapAsync = require("../utils/wrapAsync");
const Errorr = require("../utils/Errorr");
const Listing = require("../models/listing");
const flash = require("connect-flash");

// const isloggedIn = (req,res,next)=>{
//         if(!req.isAuthenticated()){
//             req.session.directed = req.originalUrl;
            
//             req.flash("error", "You must be loged in first");
            
//             return res.redirect("/user/login");

//         }
//         next();
// }


//index route
module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
}

//new listing form
module.exports.new = (req,res)=>{

    res.render("listings/new.ejs");    
   
}

//create new listing
module.exports.create = async(req,res)=>{
    if(!req.body.listing){
        throw new Errorr(300, "listing not provided");
    }
    
    let url = req.file.path;
    let fileName = req.file.fileName;
        let listing = new Listing(req.body.listing);
        listing.owner = req.user._id
        listing.image = {url,fileName};
         await listing.save();
    req.flash("success","Listing added successfully");
       res.redirect("/listings");
    }

//edit listing page
    module.exports.edit =async (req,res)=>{
        let listing = await Listing.findById(req.params.id);
        let original = listing.image.url;
        original = original.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs", {listing, original});
    }

//update listing
module.exports.update = async (req,res)=>{
    console.log({...req.body});
    console.log(req.file);
    let listing = await Listing.findByIdAndUpdate(req.params.id, {...req.body.listing}   )   ;
   

      if(typeof req.file !== "undefined"){
   let url = req.file.path;
    let fileName = req.file.fileName;
    listing.image = {url  ,fileName};
    await listing.save();
  }

    res.redirect(`/listings/${req.params.id}`);
}

//Delete listing
module.exports.delete =async (req,res)=>{
    
    await Listing.findByIdAndDelete(req.params.id)   ;
    res.redirect("/listings");
}

//listing page 
module.exports.show=async (req,res)=>{
    
    let listing = await Listing.findById(req.params.id).populate({path: "reviews" , populate :{path: "author"}}).populate("owner");
    res.render("listings/show.ejs", {listing});
}