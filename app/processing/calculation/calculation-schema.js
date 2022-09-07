const Joi = require('joi')

module.exports = Joi.object({
  sbi: Joi.number().integer().required(),
  calculationDate: Joi.date().required()
}).required()
