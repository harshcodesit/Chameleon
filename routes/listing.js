const express = require("express");
const router = express.Router(); 

const wrapAsync = require("../utils/wrapAsync");
const Errorr = require("../utils/Errorr");
const Listing = require("../models/listing");
const flash = require("connect-flash");
const listingCont= require("../controllers/listing");
const multer  = require('multer');
const {storage} = require("../cloudConfig")
const upload = multer({storage });
const isloggedIn = (req,res,next)=>{
        if(!req.isAuthenticated()){
            req.session.directed = req.originalUrl;
            
        
            req.flash("error", "You must be loged in first");
            
            return res.redirect("/user/login");

        }
        next();
}





router.route("/")
.get(wrapAsync(listingCont.index))
.post(upload.single('listing[image]'),wrapAsync(listingCont.create));



//new listing form
router.get("/new",isloggedIn, listingCont.new);


//edit listing page 
router.get("/:id/edit",isloggedIn, wrapAsync(listingCont.edit));

router.route("/:id")
.put(isloggedIn, upload.single('listing[image]'),wrapAsync(listingCont.update))
.delete(isloggedIn,wrapAsync(listingCont.delete))
.get(wrapAsync(listingCont.show));



module.exports = router;