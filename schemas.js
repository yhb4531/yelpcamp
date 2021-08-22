const Joi = require('joi');

//This does not validate each inputs.. If one input is satisfied, this will be skipped
// if(!req.body.attraction) throw new ExpresError('Invalid attraction Data', 400);
module.exports.attractionSchema = Joi.object({
    attraction: Joi.object({
        title: Joi.string().required(),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required()
    }).required()
})