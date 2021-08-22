const Attraction = require('../models/attraction');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    attraction.reviews.push(review);
    await review.save();
    await attraction.save();
    req.flash('success', 'New review added!');
    res.redirect(`/attractions/${attraction._id}`)
}

module.exports.reviewDelete = async (req, res) => {
    const {id, reviewId} = req.params;
    await Attraction.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!');
    res.redirect(`/attractions/${id}`);
}