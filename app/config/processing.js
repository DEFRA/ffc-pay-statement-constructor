const Joi = require('joi')

const schema = Joi.object({
  settlementProcessingInterval: Joi.number().default(10000), // 10 seconds
  scheduleProcessingMaxElaspedTime: Joi.number().default(300000) // 5 minutes
})

const config = {
  settlementProcessingInterval: process.env.SETTLEMENT_PROCESSING_INTERVAL,
  scheduleProcessingMaxElaspedTime: process.env.SCHEDULE_PROCESSING_ELASPED_MAX_TIME
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
