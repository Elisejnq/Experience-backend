const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    game: String,
    username: {type:mongoose.Schema.Types.ObjectId, ref: 'usersLogin'},
    photo: {type:mongoose.Schema.Types.ObjectId, ref: 'userProfile'},
    coach: {type:mongoose.Schema.Types.ObjectId, ref: 'coachesprofile'},
    content: String,
    rating: { type: Number, min: 1, max: 5 },
});

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review;