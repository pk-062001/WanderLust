const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const { isloggedIn , isOwner , validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync( listingController.index ))
.post( isloggedIn,  upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));

// new route
router.get("/new", isloggedIn, listingController.renderNewForm);

router.route("/:id")
.get(  wrapAsync( listingController.show ))
.put( isloggedIn,isOwner, upload.single("listing[image]"), validateListing, wrapAsync( listingController.updateListing))
.delete(isloggedIn ,isOwner, wrapAsync(listingController.deleteListing ));

// edit route
router.get("/:id/edit", isloggedIn, isOwner,wrapAsync( listingController.editListing ));

module.exports = router;

// Index route
// router.get("/",wrapAsync( listingController.index ));


// Show Route
// router.get("/:id",  wrapAsync( listingController.show ));

// Create Route
// router.post("/", isloggedIn, validateListing, wrapAsync(listingController.createListing));



// update route
// router.put("/:id", isloggedIn,isOwner, validateListing, wrapAsync( listingController.updateListing));

// Delete route
// router.delete("/:id",isloggedIn ,isOwner, wrapAsync(listingController.deleteListing ));



