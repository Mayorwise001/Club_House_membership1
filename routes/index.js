const express = require('express');
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const flash = require('connect-flash');
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/authenticate')

router.use(flash());
router.use(passport.initialize());
router.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
router.use(passport.session());
router.use(express.urlencoded({ extended: false }));



// Make flash messages available to all views
router.use((req, res, next) => {
    res.locals.error = req.flash('error');
    next();
});
router.get("/", (req, res) => {
    res.render("index", { user: req.user });
  });
  
router.post(
    "/log-in",
    passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true // Enable flash messages
    })
  );
  

router.get("/sign-up", (req, res) => res.render("sign-up-form"));

router.post('/sign-up',async (req, res) => {
    const { username, password} = req.body;

    const newProduct = new User({
        username, 
        password
    });
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, do something
        // otherwise, store hashedPassword in DB
     
      
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create a new user with the hashed password
            const newUser = new User({
                username,
                password: hashedPassword
            });
    
            // Save the user to the database
            const savedUser = await newUser.save();
    
            res.redirect('/');
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
});
});

router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
  


passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        // if (user.password !== password) {
        //   return done(null, false, { message: "Your Password is Incorrect!" });
        // };
        const match = await bcrypt.compare(password, user.password);
if (!match) {
  // passwords do not match!
  return done(null, false, { message: "Incorrect password" })
}
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
  );

  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
  });
  


  module.exports = router;