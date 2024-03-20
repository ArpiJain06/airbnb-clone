const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { validateListing, isLoggedIn, isOwner } = require('../middleware.js');

//index route
router.get('/', wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", {allListings});
}));
//create route
router.post('/',validateListing, wrapAsync(async (req, res, next)  =>{
    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    req.flash("success","New Listing Created");
    await newListing.save();
    res.redirect("/listings");
}));
//new route
router.get('/new',isLoggedIn, wrapAsync(async (req, res)=>{
    res.render("listings/new.ejs");
}));
//edit route
router.get('/:id/edit',isLoggedIn, wrapAsync(async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    // console.log("edit");
    res.render("listings/edit.ejs", {listing});
}));
//update route
router.put('/:id',isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete('/:id', wrapAsync(async (req, res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));
//show route
router.get('/:id', wrapAsync(async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    .populate({ 
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","This Listing does not exist");
        res.redirect(`/listings/${id}`);
    }
    // console.log(listing._id);
    res.render("listings/show.ejs", {listing});
}));
module.exports = router;