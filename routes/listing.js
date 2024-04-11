const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing, isLoggedIn, isOwner } = require('../middleware.js');
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({storage});

// Multiple routing
router
    .route('/')
    //index route
    .get(wrapAsync(listingController.index))
    //create route
    .post(
        isLoggedIn,  
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );
//new route
router.get('/new',isLoggedIn, wrapAsync(listingController.renderNewForm));

router
    .route('/:id')
    //update route
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(listingController.updateListing)
    )
    //delete route
    .delete(wrapAsync(listingController.destroyListing))
    //show route
    .get(wrapAsync(listingController.showListing));

//edit route
router.get('/:id/edit',isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;
