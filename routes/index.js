var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get('/', function(req, res){
  res.render('landing');
});


// AUTH ROUTES

// Register form

router.get('/register', function(req, res){
  res.render('register');
});

// Registration
router.post('/register', function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
      if(err){
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/campgrounds");
      });
  });
});

// Login form
router.get('/login', function(req, res){
  res.render('login');
});

// Login
router.post('/login', passport.authenticate("local",
 {
   successRedirect: "/campgrounds",
   failureRedirect: "/login"
 }), function(req, res){
});

router.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/campgrounds');
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
// Logout Route

module.exports = router;
