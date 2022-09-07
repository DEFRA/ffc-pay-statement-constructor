const Joi = require('joi')

const { DAX_CODES } = require('../../constants/schedules')

module.exports = Joi.object({
  paymentRequestId: Joi.number().integer().required(),
  dueDate: Joi.date().required(),
  marketingYear: Joi.number().integer().required(),
  schedule: Joi.string().optional().allow(null).default(DAX_CODES.QUARTERLY)
}).required()
