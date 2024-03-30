const express = require('express');
const router = express.Router();
const User= require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');

router.get("/signup", (req, res)=>{
    res.render("users/signup.ejs");
});
// app.get("/demouser", async(req, res)=>{
//     let fakeUser= new User({
//         email:"shassasja2@gmail.com",
//         username:"002ahwu1212"
//     });
//     let newUser= await User.register(fakeUser, "paokjshy");
//     res.send(newUser);
// });

router.post("/signup", wrapAsync(async(req,res, next)=>{
    try{
        let { username, email, password }= req.body;
        const newUser = new User({ email,username });
        const registeredUser = await User.register(newUser, password);
        // user will login automatically, when he signsup
        req.login(registeredUser, (err)=>{ 
            if(err){
                next(err);
            }
            req.flash("success", "SignUp Completed");
            res.redirect("/listings");
        })   
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));
router.get("/login", (req, res)=>{
    res.render("users/login.ejs");
});
router.post("/login",
    saveRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash:true
    }),
    async(req,res)=>{
        req.flash("success","Login Successful");
        // console.log(res.locals.redirectUrl);
        //if res.locals.redirectUrl does not have something than it goes to listings 
        // let redirectUrl= res.locals.redirectUrl;
        // res.redirect(redirectUrl);
        res.redirect("/listings");
});
router.get("/logout",(req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Logout Successful");
        res.redirect("/listings");
    })
});
module.exports = router;