const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js")

const listingController = require('../controllers/listings.js');

// index route
router.get("/", wrapAsync(listingController.index))

//New route
router.get("/new", isloggedIn, listingController.renderNewform)


// show route
router.get("/:id", wrapAsync(listingController.showListings))


// create route
router.post("/", validateListing,
  isloggedIn,
  wrapAsync(listingController.createListings)
);


// edit route
router.get("/:id/edit",
  isloggedIn, isOwner,
  wrapAsync(listingController.editListings))

// update route
router.put("/:id",
  isloggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListings));

// delete route
router.delete(
  "/:id",
  isloggedIn, isOwner,
  wrapAsync(listingController.deleteListings)
);

module.exports = router;