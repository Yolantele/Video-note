var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

// Load routes
var ideas = require('./routes/ideas');
var users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

// DB Config
var db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(db.mongoURI, {
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

// to be able to use Static folder (public)
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session (secret) middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables:
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//--- ROUTES : ---

// Index
app.get('/', function(req, res){
  var title = 'Video Note';
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


var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log(`Server started on post ${port}`);
});
