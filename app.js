const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExoressError.js")


main()
  .then(() => { console.log("DB is connected") })
  .catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use("/public", express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.send("listening to root");
})

// index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}))

//New route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs")
})


// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing })
  // res.send("fuck");
}))


// create route
app.post("/listings", wrapAsync(
  async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid listing detail")
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }
)
);


// edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing })
}))

// update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "send valid listing detail")
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// delete route



// app.get("/testListing", async(req,res)=>{
//   let sampleListing = new Listing({
//     title : "TAJ HOTEL",
//     descripition : "best hotel in Goa",
//     price: "59000",
//     location : "Goa",
//     country : "INDIA"
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("success")
// });


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"))
})

app.use((err, req, res, next) => {
  let { statusCode = 505, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", {message});
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("listenign to port 8080")
})