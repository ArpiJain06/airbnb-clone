const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path= require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const expressError = require("./utils/expressError");
const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// requires the model with Passport-Local Mongoose plugged in
const User = require("./models/user.js");

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
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecrestcode",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now()+1000*60*60*24*7,//this is in millisecs
        maxAge:1000*60*60*24*7,// no. of millisecs in 1 week
        httpOnly: true        
    },
};

app.get('/', (req, res) => {
    res.send('Hello World!')
});

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

