if(process.env.NODE_ENV !== "production") {
    require("dotenv").config(); // to use environment variables from .env file
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local"); 

// Importing routes -> express route for listings
const listingRouter = require("./routes/listing.js");

// Importing routes -> express route for reviews
const reviewRouter = require("./routes/review.js");

// Importing routes -> express route for user
const userRouter = require("./routes/user.js");
const Listing = require("./models/listing.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));   // for parsing data from request
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// Mongo related info
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
})

store.on("error", () =>{
    console.log("Error in Session Store", err);
})

// session middleware
const sessionOption = {
    store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true, // prevents client side js from accessing the cookie
    }
}

// testing server
// app.get("/", (req, res) => {
//     res.send("hi, i am root")
// });

// using session middleware
app.use(session(sessionOption));
// using flash middleware
app.use(flash());


// using passport middleware with using session which we have defined above
app.use(passport.initialize());
app.use(passport.session());  // ability to identify the user across page to page requests

passport.use(new LocalStrategy(User.authenticate())); // using local strategy for authentication
passport.serializeUser(User.serializeUser()); // serializing the user(serializing means storing the user in the session)
passport.deserializeUser(User.deserializeUser()); // deserializing the user


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // current user is the user who is logged in
    // console.log(res.locals.success);
    next();
});

// welcome home page route
// app.get("/home", (req, res) => {
//     res.render("listings/home.ejs");
// });

app.get('/listings', async (req, res) => {
    const query = req.query.q;
    let allListings;

    try {
        if (query && typeof query === 'string') {
            allListings = await Listing.find({
                title: { $regex: query.trim(), $options: 'i' }
            });
        } else {
            allListings = await Listing.find({});
        }

        res.render('listings/index', {
            allListings,
            searchQuery: query || ''
        });
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).send('Something went wrong');
    }
});

// using the listings route
app.use("/listings", listingRouter);

// using the reviews route
app.use("/listings/:id/reviews", reviewRouter);

// using the user route
app.use("/", userRouter);



app.all("*" , (req, res,next) =>{
    next(new ExpressError(404, "Page not found...!!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err;  
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs" , {message});
});
// app.use((err, req, res, next) => {
//     console.error("🔥 Error caught in middleware:", err); // <-- Add this line

//     let { statusCode = 500, message = "Something went wrong" } = err;

//     res.status(statusCode).render("error.ejs", { message });
// });

app.listen(8080, () => {
    console.log(`server islistening on port 8080`);
});

