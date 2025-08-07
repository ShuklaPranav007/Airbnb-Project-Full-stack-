const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

const listingController = require('../controllers/listings.js');
const { reviewSchema } = require("../schema.js");

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListings)
  );
  

//New route
router.get("/new", isloggedIn, listingController.renderNewform)

router.route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isloggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListings))
  .delete (isloggedIn, isOwner,
  wrapAsync(listingController.deleteListings)
);



// edit route
router.get("/:id/edit",
  isloggedIn, isOwner,
  wrapAsync(listingController.editListings))

module.exports = router;