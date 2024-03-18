const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String, 
        set : (v)=>
         v=== "" ? 
         "https://images.pexels.com/photos/70441/pexels-photo-70441.jpeg?auto=compress&cs=tinysrgb&w=600"
         :v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ]
});
//delete all the reviews of a listing, when that listing is deleted
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing= mongoose.model("Listing", listingSchema);
module.exports=Listing;