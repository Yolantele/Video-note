// file for defining the strategies

var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Load user models
var User = mongoose.model('users');

// export with instance of passport from app.js
module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email'}, function(email, password, done){
    console.log(email);
  }));
};
