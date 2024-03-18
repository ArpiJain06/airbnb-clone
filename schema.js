const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image:Joi.string().allow("", null),// empty string and null values are allowed in string
    price: Joi.number().integer().min(0),// price should be positive value
    location: Joi.string().required(),
    country: Joi.string().required(),    
});
module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
});
