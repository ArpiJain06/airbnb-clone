if(process.env.Node_ENV != "production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);
const express = require('express');
const app = express();
const port = 8080;
const dbUrl = process.env.ATLAS_URL;
const mongoose = require('mongoose');
const path= require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const expressError = require("./utils/expressError");
const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// requires the model with Passport-Local Mongoose plugged in
const User = require("./models/user.js");
const Listing = require("./models/listings.js");
const listingController = require("./controllers/listings.js");
const wrapAsync = require("./utils/wrapAsync.js");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});
main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err => {
    console.log(err)
});
app.engine('ejs', engine);
async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
  await mongoose.connect(dbUrl);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600, // after 24hrs
});

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
})
const sessionOptions = {
    store,// mongo-session info goes to session
    secret: "mysupersecrestcode",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now()+1000*60*60*24*7,//this is in millisecs
        maxAge:1000*60*60*24*7,// no. of millisecs in 1 week
        httpOnly: true        
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;// stores the info of current user loggedin 
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//search request
app.get('/search', async (req, res) => {
    const query = req.query.q;
    console.log(query);
    Listing.find({ title: query })
    .then(listings => {
        console.log(listings);
        res.render("listings/show.ejs", {listings});
    }) 
    .catch (error=> {
        console.error("Error: ",error);
        res.status(500).json({ message: 'Internal server error' });
    })
});

// if the route entered by user is wrong
app.all("*",(req,res,next)=>{
    next(new expressError(404, "page not found!"));
});

//error response
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something Went Wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
});