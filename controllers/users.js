const User= require("../models/user.js");

module.exports.renderSignupForm= (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res, next)=>{
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
};

module.exports.renderLoginForm= (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login= async(req,res)=>{
    req.flash("success","Login Successful");
    //if res.locals.redirectUrl does not have something than it goes to listings 
    let redirectUrl= res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Logout Successful");
        res.redirect("/listings");
    })
};
