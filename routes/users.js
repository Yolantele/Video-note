var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// --- ROUTES : ---

// User Log:
router.get('/login', function(req, res){
  res.render('users/login');
});

// User register:
router.get('/register', function(req, res){
  res.render('users/register');
});

// Register form post
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
    res.send('passed');
  }
});


module.exports = router;
