var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')

var app = express();

// Map global promise - get rif of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://jolanta:jolanta@ds231987.mlab.com:31987/jolantajas', {
  useMongoClient: true
})
  .then(function(){
    console.log('MongoDB Connected...');
  })
  .catch(function(err){
    console.log(err);
  });

// Load idea model
require('./models/Idea');
var Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));


//--- ROUTES ---

// Index Route
app.get('/', function(req, res){
  var title = 'Welcome1';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', function(req, res){
  res.render('about');
});

// Idea index page fetch from DB
app.get('/ideas', function(req, res){
  Idea.find({})
    .sort({date: 'desc'})
    .then(function(ideas) {
      res.render('ideas/index',{
        ideas: ideas
      });
    });
});

// Add Idea Form
app.get('/ideas/add', function(req, res){
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', function(req, res){
  Idea.findOne({
    _id: req.params.id
  })
  .then(function(idea){
    res.render('ideas/edit', {
      idea: idea
    });
  });
});

// process form
app.post('/ideas', function(req, res) {
  var errors = [];
  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text: 'Please add some details'});
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });

  } else {
    var newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser)
      .save()
      .then(function(idea){
        res.redirect('/ideas');
      });
  }
});
// Edit form process
app.put('/ideas/:id', function(req, res){
  Idea.findOne({
    _id: req.params.id
  })
  .then(function(idea){
    // new values replaced and saved
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
      .then(function(idea){
        res.redirect('/ideas');
      });
  });
});


var port = 5000;
app.listen(port, function(){
  console.log(`Server started on post ${port}`);
});
