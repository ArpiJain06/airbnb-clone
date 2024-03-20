const mongoose = require('mongoose');
const schema= mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema= new schema({
    email:{
        type:String,
        required:true,
    }
});
userSchema.plugin(passportLocalMongoose);
//Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value by its own.
module.exports= mongoose.model('User',userSchema);