const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');

const upload = multer({storage});

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

//order matters, as if this block goes under /:id block, this block will be ignored
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.campgroundDetail))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.campgroundUpdate))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.campgroundDelete));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;