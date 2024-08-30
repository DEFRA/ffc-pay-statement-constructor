const Joi = require('joi')
const mqConfig = require('./message')
const dbConfig = require('./database')
const processingConfig = require('./processing')

const schema = Joi.object({
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  statementConstructionActive: Joi.boolean().default(false),
  scheduleConstructionActive: Joi.boolean().default(false)
})

const config = {
  env: process.env.NODE_ENV,
  statementConstructionActive: process.env.STATEMENT_CONSTRUCTION_ACTIVE,
  scheduleConstructionActive: process.env.SCHEDULE_CONSTRUCTION_ACTIVE
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

const value = result.value

value.isDev = value.env === 'development'
value.isTest = value.env === 'test'
value.isProd = value.env === 'production'

value.processingSubscription = mqConfig.processingSubscription
value.submitSubscription = mqConfig.submitSubscription
value.returnSubscription = mqConfig.returnSubscription
value.statementTopic = mqConfig.statementTopic
value.statementDataSubscription = mqConfig.statementDataSubscription

value.dbConfig = dbConfig
value.processingConfig = processingConfig

module.exports = value
