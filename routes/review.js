const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isloggedIn, isReviewAuthor } = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")

// review route
// post route
router.post("/", isloggedIn, validateReview,
  wrapAsync(reviewController.postReview));


// delete review route
router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deletereview)
);

module.exports = router;