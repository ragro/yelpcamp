var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var Middleware  = require("../middleware/middleware");
//Comments New
router.get("/new", Middleware.isLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//Comments Create
router.post("/",Middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   if(req.isAuthenticated){
            
            Campground.findById(req.params.id, function(err, campground){
               if(err){
                   req.flash("error", err.message);
                   res.redirect("/campgrounds");
               } else {
                    Comment.create(req.body.comment, function(err, comment){
                       if(err){
                              req.flash("error", err.message);

                       } else {
                           //add username and id
                           comment.author.id = req.user._id;
                           comment.author.username = req.user.username;
                           //save comment
                           comment.save();
                           campground.comments.push(comment);
                           campground.save();
                           req.flash("success","Comment created");
                           res.redirect('/campgrounds/' + campground._id);
                       }
                });
               }
           });
   }else{
       req.flash("error","You need to login first");
       res.render("login");
   }
   
});


// Comments Edit Route
router.get("/:comment_id/edit", function(req , res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           req.flash("error", err.message);
           res.redirect("back");
       }else{
           console.log(foundComment);
           res.render("comments/edit",{campground_id:req.params.id,comment: foundComment});
       }
    });
});

//Comment Update Route
router.put("/:comment_id", function(req, res){
   res.send("you updated ");
});

//Comment Detroy Route
router.delete("/:comment_id", function(req, res){
    
});




module.exports = router;