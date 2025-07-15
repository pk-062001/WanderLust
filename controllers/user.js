const User = require("../models/user.js");

// rendering signup page
module.exports.renderSignup = (req, res) => {
    // Render the signup page
    res.render("users/signup.ejs");
}

// user signup controller
module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Successfully signed up! You can now log in.");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req, res) => {
    // Render the login page
    res.render("users/login.ejs");
}


module.exports.login = async (req, res) => {
    // If authentication is successful, redirect to the home page
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings");
}


module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
}


