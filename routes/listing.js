const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner,validateListing  } = require("../middleware.js")



// index route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}))

//New route
router.get("/new", isloggedIn, (req, res) => {
  res.render("./listings/new.ejs")
})


// show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path : "reviews",
    populate : {
      path : "author"
    }
  }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("./listing.ejs")
  }
  res.render("./listings/show.ejs", { listing })
  // console.log(listing)
}))


// create route
router.post("/", validateListing,
  isloggedIn,
  wrapAsync(
    async (req, res, next) => {
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success", "New listing Added")
      res.redirect("/listings");
    }
  )
);


// edit route
router.get("/:id/edit",
  isloggedIn, isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      // req.flash("success", "Edit successful")
      req.flash("error", "Listing you requested does not exist");
      res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing })
  }))

// update route
router.put("/:id",
  isloggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`)
  }));

// delete route
router.delete(
  "/:id",
  isloggedIn, isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing Deleted")
    res.redirect("/listings");
  })
);

module.exports = router;