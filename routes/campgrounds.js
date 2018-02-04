var express = require("express"),
     router  = express.Router(),
     Campground = require("../models/campground"),
     Middleware = require("../middleware/middleware");
//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/",Middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
            req.flash("error", err.message);
        } else {
            //redirect back to campgrounds page
            req.flash("success", "Campground Created Successfully");
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new",Middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", err.message);
            console.log(err);
        } else {
            // console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit Form Route
router.get("/:id/edit",Middleware.checkCampgroundOwenership, function(req, res){
    
            Campground.findById(req.params.id, function(err, foundCampground){
              if(err){
                  req.flash("error", err.message);
                  res.redirect("/");
              } else{
                                 res.render("campgrounds/edit",{campground: foundCampground} );                  
                    }
            });

});

//Update Route
router.put("/:id",Middleware.checkCampgroundOwenership, function(req, res){
    
            Campground.findById(req.params.id, function(err, foundCampground){
              if(err){
                       req.flash("error", err.message);
                       res.redirect("/");
              } else{
                                        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
                                        if(err){
                                            req.flash("error", err.message);
                                            res.redirect("/campgrounds");
                                        } else{
                                            req.flash("success","Campground Updated Successfully")                                              
                                            res.redirect("/campgrounds/"+req.params.id);
                                        }
                                   });
                          
                    }
            });
        
    
    
});


//Destroy Route
router.delete("/:id", Middleware.checkCampgroundOwenership, function(req, res){
    
        Campground.findById(req.params.id, function(err, foundCampground){
              if(err){
                    req.flash("error", err.message);
                    res.redirect("/");
              } else{
                                  Campground.findByIdAndRemove(req.params.id, function(err){
                                       if(err){
                                               req.flash("error", err.message);
                                               res.redirect("/campgrounds");
                                       }else{
                                           req.flash("success", "Campground destroyed successfully");
                                           res.redirect("/campgrounds");
                                       }
                                  }); 
                    }
            });
    
});


module.exports = router;

