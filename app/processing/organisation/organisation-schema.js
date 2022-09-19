const Joi = require('joi')

module.exports = Joi.object({
  sbi: Joi.number().integer().required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow('').allow(null).default(''),
  addressLine3: Joi.string().required(),
  city: Joi.string().required(),
  county: Joi.string().allow('').allow(null).default(''),
  emailAddress: Joi.string().required(),
  frn: Joi.number().integer().required(),
  name: Joi.string().required(),
  postcode: Joi.string().required()
}).required()
