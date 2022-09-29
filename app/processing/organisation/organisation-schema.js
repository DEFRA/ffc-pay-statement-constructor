const Joi = require('joi')

module.exports = Joi.object({
  sbi: Joi.number().integer().min(105000000).max(999999999).required(),
  addressLine1: Joi.string().optional(),
  addressLine2: Joi.string().optional(),
  addressLine3: Joi.string().optional(),
  city: Joi.string().optional(),
  county: Joi.string().optional(),
  emailAddress: Joi.string().email().required(),
  frn: Joi.number().integer().min(1000000000).max(9999999999).required(),
  name: Joi.string().required(),
  postcode: Joi.string().required()
}).required()
