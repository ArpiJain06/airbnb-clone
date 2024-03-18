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
        default:"https://www.freepik.com/free-photo/beautiful-tropical-empty-beach-sea-ocean-with-white-cloud-blue-sky-background_11408956.htm#query=beach&position=0&from_view=keyword&track=sph&uuid=521f65a2-8107-4d4f-8ddc-c1bf0ed9a1bb",
        set : (v)=>
         v=== "" ? 
         "https://www.freepik.com/free-photo/beautiful-tropical-empty-beach-sea-ocean-with-white-cloud-blue-sky-background_11408956.htm#query=beach&position=0&from_view=keyword&track=sph&uuid=521f65a2-8107-4d4f-8ddc-c1bf0ed9a1bb" 
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