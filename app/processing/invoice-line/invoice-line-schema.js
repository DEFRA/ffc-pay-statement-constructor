const Joi = require('joi')

module.exports = Joi.object({
  value: Joi.number().integer().required()
}).required()
