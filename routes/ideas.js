var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var {ensureAuthenticated} = require('../helpers/auth');


// Load idea model
require('../models/Idea');
var Idea = mongoose.model('ideas');

// --- ROUTES : ---

// Idea index page fetch from DB
router.get('/', ensureAuthenticated, function(req, res){
  Idea.find({user:req.user.id})
    .sort({date: 'desc'})
    .then(function(ideas) {
      res.render('ideas/index',{
        ideas: ideas
      });
    });
});

// Add Idea Form
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Idea.findOne({
    _id: req.params.id
  })
  .then(function(idea){
    if (idea.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('ideas/');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

// Process form
router.post('/', ensureAuthenticated, function(req, res) {
  var errors = [];
  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text: 'Please add some details'});
  }
  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });

  } else {
    var newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser)
      .save()
      .then(function(idea){
        req.flash('success_msg', 'Video idea added');
        res.redirect('/ideas');
      });
  }
});

// Process Edit form
router.put('/:id', ensureAuthenticated,  function(req, res){
  Idea.findOne({
    _id: req.params.id
  })
  .then(function(idea){
    // new values replaced and saved
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
      .then(function(idea){
        req.flash('success_msg', 'Video idea updated');
        res.redirect('/ideas');
      });
  });
});

// Delete idea from DB
router.delete('/:id', ensureAuthenticated, function(req, res){
  Idea.remove({ _id: req.params.id })
  .then(function(){
    req.flash('success_msg', 'Video idea removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
