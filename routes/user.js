const express = require ('express');
const router = express.Router();
const bcrypt =require ('bcryptjs');

//Bring in User models
let User = require('../models/user');

//Register form
router.get('/register', function(req, res){
  res.render('register');
});

//Registration Process
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const cpassword = req.body.cpassword;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('cpassword', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  }
  else {
    let user = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
          user.password = hash;
          user.save(function(err){
            if(err){
              console.log(err);
              return;
            }else{
              req.flash('success', 'You are now registered and can log in');
              res.redirect('/users/login');
            }
          });
      });
    });
  }
});

//Login form
router.get('/login', function(req, res){
  res.render('login');
});

module.exports = router;
