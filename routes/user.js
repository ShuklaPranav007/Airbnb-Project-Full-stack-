const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings")
        })

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("signup");
    }
}))

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    // async (req,res)=>{
    //     res.redirect("/listings");
    async (req, res) => {
        req.flash("success", "welcome to Wanderlust!!! you are loggedIn");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
        
    }
    
);

// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) return next(err);
//     if (!user) {
//       req.flash('error', 'Invalid credentials');
//       return res.redirect('/login');
//     }
//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       req.flash('success', 'Welcome back!');
//       res.redirect('/dashboard');
//     });
//   })(req, res, next);
// });


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
})

module.exports = router;