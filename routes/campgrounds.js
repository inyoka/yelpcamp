var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");


// INDEX - Displays list of all campgrounds.

// Images from https://www.photosforclass.com/search?text=camping
router.get('/', function(req, res){
    // Get all campgrounds from server.
    Campground.find({}, function(err, allCampgrounds){
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/index', {campgrounds:allCampgrounds});
      }
    });
});

// CREATE - Add new campground to DB.

router.post('/', isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, image: image, description: desc, author: author}
  //  Create new campground and save to DB.
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW - Displays form for new campground.
router.get('/new', isLoggedIn, function(req, res){
  res.render('campgrounds/new');
});

// SHOW - Displays info about one campground.
router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// EDIT campground route. (form)
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground:foundCampground});
    });
});

// UPDATE campground route. (submit address)
router.put("/:id", checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
     if(err){
         res.redirect("/campgrounds");
     } else {
         res.redirect("/campgrounds/" + req.params.id);
     }
  });
});

// DESTROY CAMPGROUND ROUTE 
router.delete("/:id", checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err) {
        res.redirect("back");
      } else {
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
