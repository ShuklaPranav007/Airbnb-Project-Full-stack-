const Joi = require('joi');
const Listing = require('./models/listing');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        Description : Joi.string().required(),
        Country : Joi.string().required(),
        Location : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("",null),


    }).required()
})