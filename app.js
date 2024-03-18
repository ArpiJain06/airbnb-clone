const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Listing = require("./models/listings.js");
const Review = require("./models/reviews.js");
const path= require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const {listingSchema, reviewSchema} = require('./schema.js');
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError");

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
//testing route
// app.get('/listings', async (req, res) => {
//     let sampleList = new Listing({
//         title:"New Villa",
//         description:"New Villa opened near beach",
//         price:2000,
//         location:"Varkala",
//         country:"India",
//     });
//     await sampleList.save()
//     .then(()=>{
//         console.log("added");
//     })
//     .catch((err)=>{
//         console.log("err");
//     });

//     res.send('successful');
// });
  
app.get('/', (req, res) => {
    res.send('Hello World!')
});
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errmsg);
    } else{
        next();
    }
};
const ValidateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errmsg);
    } else{
        next();
    }
};
//index route
app.get('/listings', wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", {allListings});
}));
//create route
app.post('/listings',validateListing, wrapAsync(async (req, res, next)  =>{
    // if(!req.body.listing){ // no new data in entered to post
    //     throw new expressError(400, "Send Valid Data for Listing")
    // }
    const newListing= new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");
}));
//new route
app.get('/listings/new', wrapAsync(async (req, res)=>{
    res.render("listings/new.ejs");
}));
//edit route
app.get('/listings/:id/edit', wrapAsync(async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    // console.log("edit");
    res.render("listings/edit.ejs", {listing});
}));
//update route
app.put('/listings/:id',validateListing, wrapAsync(async (req, res)=>{
    // if(!req.body.listing){
    //     throw new expressError(400, "Send Valid Data for Listing")
    // }
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete('/listings/:id', wrapAsync(async (req, res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
//show route
app.get('/listings/:id', wrapAsync(async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));
//post route for reviews
app.post("/listings/:id/reviews",ValidateReview, wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        console.log("listing not present");
        return res.status(404).send('Listing not found');
    }  
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));
//delete route for reviews
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
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
// app.use((err, req, res, next)=>{
//     res.send(err);
// });
