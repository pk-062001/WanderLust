const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (userController.login));

// user logout route
router.get("/logout", userController.logout);

module.exports = router;


// user registration route
// router.get("/signup", userController.renderSignup);

// router.post("/signup", wrapAsync(userController.signup));

// user login route
// router.get("/login", userController.renderLogin);

// router.post("/login",saveRedirectUrl, passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true
// }), (userController.login));




