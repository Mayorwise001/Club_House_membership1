const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/authenticate")

module.exports = function(passport){
    // passport.use(
    //     new LocalStrategy(async (username, password, done) => {
    //       try {
    //         const user = await User.findOne({ username: username });
    //         if (!user) {
    //           return done(null, false, { message: "Incorrect username" });
    //         };
    //         // if (user.password !== password) {
    //         //   return done(null, false, { message: "Your Password is Incorrect!" });
    //         // };
    //         const match = await bcrypt.compare(password, user.password);
    // if (!match) {
    //   // passwords do not match!
    //   return done(null, false, { message: "Incorrect password" })
    // }
    //         return done(null, user);
    //       } catch(err) {
    //         return done(err);
    //       };
    //     })
    //   );
    
      
    //   passport.serializeUser((user, done) => {
    //     done(null, user.id);
    //   });
      
    //   passport.deserializeUser(async (id, done) => {
    //     try {
    //       const user = await User.findById(id);
    //       done(null, user);
    //     } catch(err) {
    //       done(err);
    //     };
    //   });
    passport.use(
        new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
          // Match user
          User.findOne({ username: username })
            .then(user => {
              if (!user) {
                return done(null, false, { message: "That username is not registered" });
              }
    
              // Match password
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                  return done(null, user);
                } else {
                  return done(null, false, { message: "Password incorrect" });
                }
              });
            })
            .catch(err => console.log(err));
        })
      );
    
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });
    
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
    
}