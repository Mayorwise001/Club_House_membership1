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

const SECRET_PASSCODE = "ADMIN"; // Choose a secret passcode

  router.get('/', async (req, res) => {
    const posts = await Post.find({});
    res.render('home', { posts, user: req.user, title:"Home"  });
  });

  router.get('/post/:id', ensureAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post-details', { post, user: req.user, title:"Details"  });
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() ||req.user.isAdmin ) {
      return next();
    }
    res.redirect('/login');
  }  

  function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    res.redirect('/');
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
  

  router.get('/become-admin', ensureAuthenticated, (req, res) => {
    res.render('become-admin', { user: req.user, title: "Become an Admin" });
  });

  router.post('/become-admin', ensureAuthenticated, async (req, res) => {
    const { passcode } = req.body;
  
    if (passcode === SECRET_PASSCODE) {
      try {
        req.user.isAdmin = true;
        await req.user.save();
        res.redirect('/');
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.render('become-admin', { user: req.user, title: "Become an Admin", error: "Incorrect passcode" });
    }
  });

  router.get('/edit-post/:id', ensureAdmin, async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('edit-post', { post, user: req.user, title: "Edit post" });
  });
  
  router.post('/edit-post/:id', ensureAdmin, async (req, res) => {
    const { title, body } = req.body;
  
    try {
      const post = await Post.findById(req.params.id);
      post.title = title;
      post.body = body;
      await post.save();
      res.redirect('/post/' + req.params.id);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Delete post
  router.post('/delete-post/:id', ensureAdmin, async (req, res) => {
    try {
       await Post.findByIdAndDelete(req.params.id);
     
      res.redirect('/');
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

router.get("/sign-up", (req, res) => {
    res.render("sign-up-form", {error: req.query.error , title:"Sign-Up Form",  user: req.user})
})

router.post('/sign-up',async (req, res) => {
    const { firstName, lastName, address, phone, email, password, confirmPassword } = req.body;
    const username = `${firstName}${lastName}`.toLowerCase();

    if (password !== confirmPassword) {
        return res.render('sign-up-form', { error: 'Passwords do not match' , title:"Sign-Up Form", user: req.user});
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
        res.redirect('/login');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/login', (req, res) => {
    res.render('login', {title:"Login", user: req.user, error: req.query.error});
  });
  



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