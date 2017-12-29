// file for defining the strategies

var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Load user models
var User = mongoose.model('users');

// export with instance of passport from app.js
module.exports = function(passport){

  passport.use(new LocalStrategy({usernameField: 'email'}, function(email, password, done){
    //Match User
    User.findOne({
      email: email
    }).then(function(user){
      if(!user){
        return done(null, false, { message: 'No user found'});
      }
      // then see if password match
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password Incorrect'});
        }
      });
    });
  }));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
      done(err, user);
    });
  });
};
