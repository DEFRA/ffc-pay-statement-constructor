const Joi = require('joi')

module.exports = Joi.object({
  accountCode: Joi.string().required(),
  description: Joi.string().required(),
  fundCode: Joi.string().required(),
  value: Joi.number().integer().required()
}).required()
