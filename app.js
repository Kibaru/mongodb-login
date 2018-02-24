const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-Parser');

mongoose.connect('mongodb://localhost/login');
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

//Get Single article
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
      res.render('article', {
        article: article
      });
   });
});

//Add route
app.get('/articless/add', function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});

//Add Submit Post route
app.post('/articless/add', function(req, res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }
    else
    {
      res.redirect('/');
    }
  });
});

//Load Edit Form
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
      res.render('edit_article', {
        title:'Edit_article',
        article: article
      });
   });
});

//Update submit
app.post('/article/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }
    else
    {
      res.redirect('/');
    }
  });
});

//Delete article
app.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

//start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
