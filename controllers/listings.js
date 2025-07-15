const Listing = require("../models/listing.js");

// Controller for listing operations
// INDEX ROUTE
module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

// Render new listing form
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

// Show route for a specific listing
module.exports.show = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    res.render("listings/show.ejs", { listing });
}

// Create a new listing
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path; // Assuming you are using multer for file uploads 
    let filename = req.file.filename; // Get the filename from multer 

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Assign the logged-in user as the owner
    newListing.image = { url, filename }; // Set the image field with the uploaded file details
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}

// Render edit form for a listing
module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not Exist!");
        return res.redirect("/listings");
    }

    let originalImage = listing.image.url; // Store the original image URL
    originalImage = originalImage.replace("/upload", "/upload/w_250"); // Adjust the URL if needed
    res.render("listings/edit.ejs", { listing, originalImage });
}

// Update a listing
module.exports.updateListing = async (req, res, next) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);
    let listing_ = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing_.image = { url, filename };
        await listing_.save();
    }
    req.flash("success", "Listing Updated successfully!");
    res.redirect(`/listings/${id}`);
}

// Delete a listing
module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}
