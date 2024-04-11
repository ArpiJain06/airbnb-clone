const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const { ValidateReview, isLoggedIn, isAuthor } = require('../middleware.js');
const reviewConroller = require("../controllers/reviews.js");

//post route for reviews
router.post("/" ,isLoggedIn,ValidateReview, wrapAsync(reviewConroller.createReview));

//delete route for reviews
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewConroller.destroyReview));

module.exports = router;