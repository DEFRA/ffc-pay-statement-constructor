const Joi = require('joi')

module.exports = Joi.object({
  scheduleId: Joi.number().integer().required(),
  settlementId: Joi.number().integer().required()
}).required()
