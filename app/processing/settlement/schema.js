const Joi = require('joi')

module.exports = Joi.object({
  paymentRequestId: Joi.number().integer().required(),
  reference: Joi.string().required(),
  settled: Joi.boolean().required()
}).required()
