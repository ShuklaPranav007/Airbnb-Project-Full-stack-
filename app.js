const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExoressError.js")

const listings = require("./routes/listing.js");
const reviewRoutes = require('./routes/review.js');


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

// root
app.get("/", (req, res) => {
  res.send("listening to root");
})


// routes
app.use("/listings", listings);
app.use('/listings/:id/reviews', reviewRoutes);



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"))
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen(8080, () => {
  console.log("listenign to port 8080")
})