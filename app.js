var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');

var app = express();

// Map global promise - get rif of warning
mongoose.Promise = global.Promise;

//Connect to mongoose (not working at the moment)
mongoose.connect('mongodb://jolanta:jolanta@ds231987.mlab.com:31987/jolantajas', {
  useMongoClient: true
})
  .then(function(){
    console.log('MongoDB Connected...');
  })
  .catch(function(err){
    console.log(err);
  });

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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


var port = 5000;
app.listen(port, function(){
  console.log(`Server started on post ${port}`);
});
