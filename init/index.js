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
  await mongoose.connect('mongodb+srv://arpitajain0609:VyrbtLGwPH6mYi3f@cluster0.7in3jds.mongodb.net/');
};
const initializeDB= async()=>{
    await Listing.deleteMany({}); // delete all data that was already present
    if (!Array.isArray(newData)) {
        console.error("Error: newData is not an array");
        return;
    }
    const updatedData = newData.map(obj => ({
        ...obj,
        owner: "6613dc0f2746cf84c7957a42"
    }));
    await Listing.insertMany(updatedData);
    console.log("Data has been added");
}
initializeDB();