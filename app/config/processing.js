const Joi = require('joi')

const schema = Joi.object({
  settlementProcessingInterval: Joi.number().default(10000) // 10 secondss
})

const config = {
  settlementProcessingInterval: process.env.SETTLEMENT_PROCESSING_INTERVAL
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
