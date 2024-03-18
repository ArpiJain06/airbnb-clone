const mongoose = require('mongoose');
const newData = require("./data.js");
const Listing = require("../models/listings.js");
main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err => {
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
};
const initializeDB= async()=>{
    await Listing.deleteMany({}); // delete all data that was already present
    await Listing.insertMany(newData.data);
    console.log("data has been added");
}
initializeDB();