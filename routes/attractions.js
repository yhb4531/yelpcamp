const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const {isLoggedIn, validateAttraction, isAuthor} = require('../middleware');
const attractions = require('../controllers/attractions');
const multer = require('multer');
const {storage} = require('../cloudinary');

const upload = multer({storage});

router.route('/')
    .get(catchAsync(attractions.index))
    .post(isLoggedIn, upload.array('image'), validateAttraction, catchAsync(attractions.createAttraction));

//order matters, as if this block goes under /:id block, this block will be ignored
router.get('/new', isLoggedIn, attractions.renderNewForm);

router.route('/:id')
    .get(catchAsync(attractions.attractionDetail))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateAttraction, catchAsync(attractions.attractionUpdate))
    .delete(isLoggedIn, isAuthor, catchAsync(attractions.attractionDelete));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(attractions.renderEditForm));

module.exports = router;