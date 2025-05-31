const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExoressError.js")
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isloggedIn } = require("../middleware.js")


// validation middlewarelisting
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


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
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("./listing.ejs")
  }
  res.render("./listings/show.ejs", { listing })
  console.log(listing)
}))


// create route
router.post("/", validateListing,
  isloggedIn,
  wrapAsync(
    async (req, res, next) => {
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      req.flash("success", "New listing Added")
      res.redirect("./listings");
    }
  )
);


// edit route
router.get("/:id/edit",
  isloggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Edit successful")
    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      res.redirect("./listing.ejs")
    }
    res.render("./listings/edit.ejs", { listing })
  }))

// update route
router.put("/:id",
  isloggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Updated")
    res.redirect(`./views/listings/{id}`);
  }));

// delete route
router.delete(
  "/:id",
  isloggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing Deleted")
    res.redirect("./listings");
  })
);

module.exports = router;