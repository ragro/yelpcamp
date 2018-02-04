var Campground = require("../models/campground");

//middleware
var middleware = { };

middleware.checkCampgroundOwenership = function(req, res, next){
        if(req.isAuthenticated())
        {
            Campground.findById(req.params.id, function(err, foundCampground){
              if(err){
                  
                  req.flash("error", err.message);
                  res.redirect("/");
              } else{
                          if(foundCampground.author.id.equals(req.user._id))
                          {
                                next();
                          }else{
                                
                                req.flash("error","You dont have permission to render this campground");
                                res.redirect("/campgrounds/"+req.params.id);
                                
                          }
                    }
            });
                
    }else{
        req.flash("error", "Please Login first");
        res.render("login");
    }
    
    
    
}

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first");
    res.redirect("/login");
}



module.exports = middleware;