const Joi = require('joi')

module.exports = Joi.array().items(
  Joi.object({
    calculationId: Joi.number(),
    area: Joi.when(
      'name', {
        is: 'Moorland',
        then: Joi.when(
          'level', {
            is: 'Additional',
            then: Joi.string().allow('').allow(null).default(''),
            otherwise: Joi.number().required()
          }
        ),
        otherwise: Joi.number().required()
      }
    ),
    rate: Joi.when(
      'name', {
        is: 'Moorland',
        then: Joi.when(
          'level', {
            is: 'Additional',
            then: Joi.string().allow('').allow(null).default(''),
            otherwise: Joi.number().required()
          }
        ),
        otherwise: Joi.number().required()
      }
    ),
    name: Joi.string().required(),
    level: Joi.string().allow('').allow(null).default('')
  })
).min(1).required()
