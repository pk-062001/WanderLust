const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchma = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
        // type: String,
        // default: "https://a0.muscache.com/im/pictures/miso/Hosting-1295537950799189040/original/76f01a5d-c78e-446e-be72-06da33bce01c.jpeg?im_w=720",
        // set: (v) => (!v || v.trim() === "") 
        // ? "https://a0.muscache.com/im/pictures/miso/Hosting-1295537950799189040/original/76f01a5d-c78e-446e-be72-06da33bce01c.jpeg?im_w=720"
        // : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})


// Middleware to delete reviews when a listing is deleted
listingSchma.post("findOneAndDelete" , async(listing)=> {
    if(listing){
        await Review.deleteMany({reviews : {_id : listing.reviews} });
    }
});

const Listing = mongoose.model("Listing", listingSchma);
module.exports = Listing;


