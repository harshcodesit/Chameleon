if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
  }

const express = require("express");
const app =  express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const Errorr = require("./utils/Errorr");
const listingsRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");


const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localstrat = require("passport-local");
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.set("views" ,path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbURL = process.env.ATLASDB_URL
//database
async function main(){
    await  mongoose.connect(dbURL);
}
main().then(()=>{
    console.log("connected to the database")
}).catch(err =>{
    console.log(err);
});



const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter: 24*3600,
})

//session
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  }));
//flash
app.use(flash());

  
  

  //passports (authentication)
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localstrat(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.directedURL = req.session.directed
    next();
  });

//home page
app.get("/",  wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
}));
//listing 
app.use("/listings", listingsRouter);

//review
app.use("/r", reviewRouter);
app.use("/user", userRouter);



//error handling
app.all("*", (req,res,next)=>{
    next(new Errorr(404, "page not found"))
});

app.use((err,req,res,next)=>{
    let{status=500, message}= err;
    if(status = 404){
        res.render("listings/error.ejs")
    }else
    res.status(status).send(message);
})

//server
app.listen(8080, ()=>{
    console.log("server is listening");
})