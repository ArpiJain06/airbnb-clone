const express = require('express');
const router = express.Router({mergeParams:true});
const { reviewSchema} = require('../schema.js');
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError");
const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");

const ValidateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errmsg);
    } else{
        next();
    }
};

//post route for reviews
router.post("/",ValidateReview, wrapAsync(async(req,res)=>{
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
    req.flash("success","New Review Posted");
    res.redirect(`/listings/${listing._id}`);
}));
//delete route for reviews
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;