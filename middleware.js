const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Reviews = require("./models/review.js");

module.exports.isloggedIn = (req, res,next) => {
    // console.log(req.user);
    if(!req.isAuthenticated() ){

        //req.originalUrl -> redirect url, eg if user not logged and tries to add new listing he will be redirected to login page and after login the user will be redirected to the page where he was trying to go
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    // Save the original URL before redirecting to login
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// create a middleware to check the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {     
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not authorized owner to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


// Joi validation middleware for listings
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,  errMsg);
    } else{
        next();
    }
}

// Joi validation middleware for reviews
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,  errMsg);
    } else{
        next();
    }
}

// Middleware to check if the user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Reviews.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect("/listings");
    }
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You did not create this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


