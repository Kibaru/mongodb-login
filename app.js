const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-Parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log('Connected to Mongodb');
});

//Check DB errors
db.on('error', function(err){
  console.log(err);
});

//Init app
const app = express();

//Bring in models
let Article = require('./models/article');

//Load view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

 //body parser midddleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session midddleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  //cookie: { secure: true }
}));

//Express Messages midddleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator midddleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

  while(namespace.length){
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param : formParam,
    msg : msg,
    value: value
   };
  }
}));

//passport config
require('./config/passport')(passport);
//passport midddleware
app.use(passport.initialize());
app.use(passport.session());

//Logout
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }
    else
    {
      res.render('index', {
        title: 'Hello Kibaru',
        articles: articles
      });
    }
  });
});

//Route files
let articles = require('./routes/article');
let users = require('./routes/user');
app.use('/articles', articles);
app.use('/users', users);

//start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
