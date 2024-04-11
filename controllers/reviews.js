const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");

module.exports.createReview = async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        console.log("listing not present");
        return res.status(404).send('Listing not found');
    }  
    let newReview= new Review(req.body.review);
    newReview.author= req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Posted");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};