const express = require('express');
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const flash = require('connect-flash');
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/authenticate');
const Post = require('../models/post');

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
// router.get("/", (req, res) => {
//     res.render("index", { user: req.user, title:"Home" });
//   });
  
  router.get('/', async (req, res) => {
    const posts = await Post.find({});
    res.render('home', { posts, user: req.user, title:"Home"  });
  });

  router.get('/post/:id', ensureAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post-details', { post, user: req.user, title:"Details"  });
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }  

  router.get('/create-post', ensureAuthenticated, (req, res) => {
    res.render('create-post', { user: req.user, title:"Create post" });
  });
  
  router.post('/create-post', ensureAuthenticated, async (req, res) => {
    const { title, body } = req.body;
  
    try {
      const newPost = new Post({
        title,
        body,
        username: req.user.username,
        createdAt: new Date()
      });
  
      await newPost.save();
      res.redirect('/');
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }





router.get("/sign-up", (req, res) => {
    res.render("sign-up-form", {error: req.query.error , title:"Sign-Up Form",  user: req.user})
})

router.post('/sign-up',async (req, res) => {
    const { firstName, lastName, address, phone, email, password, confirmPassword } = req.body;
    const username = `${firstName}${lastName}`.toLowerCase();

    if (password !== confirmPassword) {
        return res.render('sign-up-form', { error: 'Passwords do not match' });
      }
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('sign-up-form', { error: 'Username already exists' , title:"Sign-Up Form", user: req.user });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.render('sign-up-form', { error: 'Email already exists', title: "Sign-Up Form", user: req.user });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            firstName,
            lastName,
            address,
            phone,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/login', (req, res) => {
    res.render('login', {title:"Login", user: req.user, error: req.query.error});
  });
  
//   router.post(
//     '/login',
//     passport.authenticate('local', {
//       failureRedirect: '/login',
//       failureFlash: true
//     }),
//     (req, res) => {
//       // If authentication succeeds, redirect to the home page or another appropriate route 
//     res.redirect('/');
//     }
//   );


router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { title: "Login", error: "Incorrect username", user: req.user });
        };

        const match = await bcrypt.compare(password, user.password);
if (!match) {
  // passwords do not match!
  return res.render('login', { title: "Login", error: "Incorrect password", user: req.user });
}

req.login(user, function(err) {
    if (err) { return next(err); }
    return res.redirect('/');
});

 } catch (err) {
        res.status(400).json({ error: err.message });
    }
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