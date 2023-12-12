var express = require('express');
var router = express.Router();
const CoachProfile = require('../models/coachesProfile'); 
const UserLogin = require('../models/usersLogin');


// Create a POST /profile route to add a new document to the coach profile collection
router.post('/profile', (req, res) => {

    // Create a new instance of the coachProfile model
    const newCoachProfile = new CoachProfile({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        photo: req.body.photo,
        user: req.body.user,
        games: req.body.games,
        bookings: req.body.bookings,
        socials: {
            twitch: req.body.twitch,
            instagram: req.body.instagram,
            youtube: req.body.youtube,
            discord: req.body.discord,
        },
        about: req.body.about,
        reviews: req.body.reviews,
    });

    // Save the new profile in the database 
    newCoachProfile.save()
    .then(data => {
        res.json(data)
    })
});
  
// Create a GET /profile route to collect the coach informations via his username
router.get('/profile/:coach', (req, res) => {
    // Search the user ID via his username
    UserLogin.findOne({username: req.params.coach}) 
    .then(user => { 
        // Search coach ID via his user ID 
        CoachProfile.findOne({user:user._id}).populate('user').populate('reviews') 
        .then (coach =>{
        console.log(coach)
        res.json({result:true, profile: coach})
        })
    }) 
})

    router.delete('/profile/:coach', (req, res) => {
        // Search user ID via username
        UserLogin.deleteOne({username: req.params.coach}) 
        .then(user => { 
        // Delete the coach profile by user ID
        CoachProfile.deleteOne({user:user._id}).populate('user')
         .then(deletedProfile => {
            if (!deletedProfile) {
             // Profile not found, send a 404 response
            res.json({ result: false, message: 'Coach profile not found' });
            } else {
            // Profile was successfully deleted, send a success response
            res.json({ result: true, message: 'Coach profile deleted successfully' });
            }
        })
    });
})

module.exports = router;
