var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

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
