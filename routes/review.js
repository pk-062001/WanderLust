const express = require('express');
const router = express.Router({mergeParams: true}); // mergeParams allows us to access params from parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const {  validateReview, isloggedIn, isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/review.js");
// Reviews route
// post route for reviews
router.post("/",isloggedIn, validateReview,wrapAsync(reviewController.createReview));

// delete route for reviews
router.delete("/:reviewId", isloggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;




