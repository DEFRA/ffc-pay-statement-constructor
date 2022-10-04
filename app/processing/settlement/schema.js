const Joi = require('joi')

module.exports = Joi.object({
  paymentRequestId: Joi.number().integer().required(),
  invoiceNumber: Joi.string().required(),
  reference: Joi.string().required(),
  settled: Joi.boolean().required(),
  settlementDate: Joi.date().required()
}).required()
