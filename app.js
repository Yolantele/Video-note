var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

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


//   ROUTES

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

// Add Idea Form
app.get('/ideas/add', function(req, res){
  res.render('ideas/add');
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
    res.send('passed');
  }
});

var port = 5000;
app.listen(port, function(){
  console.log(`Server started on post ${port}`);
});
