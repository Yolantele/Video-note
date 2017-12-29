var express = require('express');
var exphbs = require('express-handlebars');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// Load routes
var ideas = require('./routes/ideas');
var users = require('./routes/users');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to external mongoDB through Mlab
mongoose.connect('mongodb://jolanta:jolanta@ds231987.mlab.com:31987/jolantajas', {
  useMongoClient: true
})
  .then(function(){
    console.log('MongoDB Connected...');
  })
  .catch(function(err){
    console.log(err);
  });


//--- MIDDLEWARE : ---

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express secret middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(flash());

// Globall variables:
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//--- ROUTES : ---

// Index
app.get('/', function(req, res){
  var title = 'Welcome1';
  res.render('index', {
    title: title
  });
});

// About
app.get('/about', function(req, res){
  res.render('about');
});

// Use routes:
app.use('/ideas', ideas);
app.use('/users', users);


var port = 5000;
app.listen(port, function(){
  console.log(`Server started on post ${port}`);
});
