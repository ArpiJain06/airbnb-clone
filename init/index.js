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
    if (!Array.isArray(newData)) {
        console.error("Error: newData is not an array");
        return;
    }
    const updatedData = newData.map(obj => ({
        ...obj,
        owner: "65facbc1e0a17429439f0a82"
    }));
    await Listing.insertMany(updatedData);
    console.log("Data has been added");
}
initializeDB();