var express = require('express');
var router = express.Router();

const Review = require('../models/reviews');
const UserLogin = require('../models/usersLogin');
const CoachProfile = require("../models/coachesProfile") 


//GET /reviews/:coach : get all reviews of a coach according to the username (via req.params)
router.get('/:coach', (req, res) => {
    UserLogin.findOne({username: req.params.coach}) //finds the user id by requiring the username
    .then(user => {
       
        CoachProfile.findOne({user:user._id}).populate('user') //finds coach id via his user id 
        .then (coach =>{
           
            Review.find({coach:coach._id}).populate('coach').populate('username') //finds coach's reviews via his coach id
            .then(data =>{
                if(data.length>0){    
                    res.json({result:true, reviews: data})
                } else {
                    res.json({result:false, reviews: data})
                }
            })   
        })
        
        })
    })

    
 

  module.exports = router



// Coach rating update
router.get('/coachRating/:username', (req, res) => {

        // Find user by username
        const user =  UserLogin.findOne({ username: req.params.username });
        if (!user) {
            return res.json({ message: "User not found" });
        }

        // Match coach profil according to username
        const coach =  CoachProfile.findOne({ user: user._id });
        if (!coach) {
            return res.json({ message: "Coach not found" });
        }

        // Rating average
        const reviews =  Review.find({ username: user._id });
        if (reviews.length === 0) {
            return res.json({ rating: "No ratings yet" });
        }

        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        // Update rating on coachProfile
        coach.rating = averageRating;
         coach.save();

        res.json({ averageRating });

});
