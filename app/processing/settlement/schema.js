const Joi = require('joi')

module.exports = Joi.object({
  invoiceNumber: Joi.string().required(),
  paymentRequestId: Joi.number().integer().required(),
  reference: Joi.string().required(),
  settled: Joi.boolean().required(),
  settlementDate: Joi.date().required()
}).required()
