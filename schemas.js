const Joi = require('joi');

//This does not validate each inputs.. If one input is satisfied, this will be skipped
// if(!req.body.campground) throw new ExpresError('Invalid campground Data', 400);
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

