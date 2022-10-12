const Joi = require('joi')

const isFirstPayment = (value, helpers) => {
  if (value.endsWith('001')) {
    return value
  }
  throw new Error('Not first payment')
}

module.exports = Joi.object({
  paymentRequestId: Joi.number().integer().required(),
  invoiceNumber: Joi.string().custom(isFirstPayment).required(),
  reference: Joi.string().required(),
  settled: Joi.boolean().required(),
  settlementDate: Joi.date().required(),
  value: Joi.number().integer().required()
}).required()
