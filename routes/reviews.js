const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utilities/catchAsync');
const {validateReview, isLoggedIn, isAuthor, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.reviewDelete));

module.exports = router;