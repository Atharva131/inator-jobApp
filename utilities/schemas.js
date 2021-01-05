const Joi = require('joi');

module.exports.applicationSchema =  Joi.object({
    application:Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        degree: Joi.string().required(),
        skills: Joi.string().required(),
        experience: Joi.string().allow(''),
        achievements: Joi.string().allow('')
    })
});