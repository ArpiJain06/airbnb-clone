const Listing = require("./models/listings.js");
const Review = require("./models/reviews.js");
const expressError = require("./utils/expressError");
const {listingSchema, reviewSchema} = require('./schema.js');

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errmsg);
    } else{
        next();
    }
};

module.exports.ValidateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errmsg);
    } else{
        next();
    }
};

module.exports.isLoggedIn= (req,res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; 
        // save the orginal url from which the request originated i.e. listings/new - here
        req.flash("error", "You are not logged in!");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
        //save it in locals so that it's value cannot be changed by passport
    }
    next();
};
//only the owner can update
module.exports.isOwner= async(req, res, next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "access denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
//only the author can delete his review
module.exports.isAuthor= async(req, res, next)=>{
    let {id, reviewId}= req.params;
    let review= await Review.findById(reviewId);
    console.log(review);
    // if(!review.author.equals(res.locals.currUser._id));{
    //     req.flash("error", "access denied");
    //     return res.redirect(`/listings/${id}`);
    // }
    next();
};