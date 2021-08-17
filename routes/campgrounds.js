const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas');


const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}))

//order matters, as if this block goes under /:id block, this block will be ignored
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Succeessfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    // This is destructuring, easier way to define than
    // const id = req.params.id
    const {id} = req.params;
    //or findById(req.params.id)
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/detail', {campground});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds');
}))

module.exports = router;