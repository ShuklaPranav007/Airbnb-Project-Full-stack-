const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js")
const multer = require+("multer");
const upload = multer({dest : 'uploads/'})

const listingController = require('../controllers/listings.js');

router.route("/")
  .get(wrapAsync(listingController.index))
  // .post(validateListing,
  //   isloggedIn,
  //   wrapAsync(listingController.createListings)
  // );
  .post(upload.single('listing[image]'),(req,res)=>{
    res.send(req.file)
  })


//New route
router.get("/new", isloggedIn, listingController.renderNewform)

router.route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isloggedIn,
    isOwner,
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