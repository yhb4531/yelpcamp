const {attractionSchema, reviewSchema} = require('./schemas');
const ExpressError = require('./utilities/ExpressError');
const Attraction = require('./models/attraction')
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please sign in to add a attraction');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateAttraction = (req, res, next) => {
    const {error} = attractionSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    // This is destructuring, easier way to define than
    // const id = req.params.id
    const {id} = req.params;
    //or findById(req.params.id)
    const attraction = await Attraction.findById(id);
    if(!attraction.author.equals(req.user._id)){
        req.flash('error', 'You do not have a permission!');
        return res.redirect(`/attractions/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have a permission!');
        return res.redirect(`/attractions/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}