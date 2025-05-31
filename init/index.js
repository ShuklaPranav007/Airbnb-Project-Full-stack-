const mongoose = require("mongoose");
const initData = require("./data")
const Listing = require("../models/listing");

main()
.then(()=>{console.log("DB is connected")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
      ...obj,
      owner : "683ac62b2c0fd42417e85500"
      // pranav123
      // pwd : pranav123
    }))
    await Listing.insertMany(initData.data);
    console.log("data was inited")
}

initDB();