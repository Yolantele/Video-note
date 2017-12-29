var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var router = express.Router();

// Load User models
require('../models/User');
var User = mongoose.model('users');

// --- ROUTES : ---

// User Log:
router.get('/login', function(req, res){
  res.render('users/login');
});

// User register:
router.get('/register', function(req, res){
  res.render('users/register');
});

//Login form POST and authentication using passport:
router.post('/login', function(req, res){
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res); //next 
});

// Register form post, saved in DB
router.post('/register', function(req, res){
 var errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text: 'Passwords do not match'});
  }
  if( req.body.password.length < 6 ){
    errors.push({text: 'Passwords must be at least 6 character long'});
  }
  if( errors.length > 0 ) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne( {email: req.body.email} )
      .then(function(user){
        if(user){
          req.flash('error_msg', 'Email already registered');
          res.redirect('/users/register');
        } else {
          var newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
              .then(function(user){
                req.flash('success_msg', 'you are now registered and can log in');
                res.redirect('/users/login');
              })
              .catch(function(err){
                console.log(err);
                return;
              });
            });
          });
        }
      });
  }
});


module.exports = router;
