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

module.exports = router;
