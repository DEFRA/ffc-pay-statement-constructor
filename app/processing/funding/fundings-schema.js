const Joi = require('joi')

module.exports = Joi.array().items(
  Joi.object({
    calculationId: Joi.number(),
    areaClaimed: Joi.number().required(),
    rate: Joi.number().required()
  })
).min(1).required()
