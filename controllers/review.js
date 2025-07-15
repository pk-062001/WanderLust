const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");

// create a new review
module.exports.createReview = async(req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id; // set the author of the review to the current user
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("Review added successfully");
    req.flash("success", "Review added successfully!");
    // res.send("Review added successfully");
    res.redirect(`/listings/${listing._id}`);
} 

// Delete a review
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findById(id);
    listing.reviews.pull(reviewId);
    await listing.save();
    console.log("Review deleted successfully");
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${listing._id}`);
}