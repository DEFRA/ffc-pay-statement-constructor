const Joi = require('joi')

module.exports = Joi.object({
  value: Joi.number().integer().min(0).required(),
  description: Joi.alternatives().conditional('value', { is: Joi.number().less(0), then: Joi.string().required(), otherwise: Joi.string().allow('', null) })
}).required()
