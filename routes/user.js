const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")

const userController = require("../controllers/user.js")

router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup))

router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
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


router.get("/logout", userController.logout)

module.exports = router;