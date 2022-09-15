const Joi = require('joi')

module.exports = Joi.object({
  value: Joi.number().integer().min(0).required()
}).required()
