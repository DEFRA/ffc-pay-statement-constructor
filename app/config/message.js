const Joi = require('joi')

const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object()
  },
  processingSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
  },
  submitSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
  },
  returnSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
  },
  statementSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
  }
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  processingSubscription: {
    address: process.env.PROCESSING_SUBSCRIPTION_ADDRESS,
    topic: process.env.PROCESSING_TOPIC_ADDRESS,
    type: 'subscription'
  },
  submitSubscription: {
    address: process.env.SUBMIT_SUBSCRIPTION_ADDRESS,
    topic: process.env.SUBMIT_TOPIC_ADDRESS,
    type: 'subscription'
  },
  returnSubscription: {
    address: process.env.RETURN_SUBSCRIPTION_ADDRESS,
    topic: process.env.RETURN_TOPIC_ADDRESS,
    type: 'subscription'
  },
  statementSubscription: {
    address: process.env.STATEMENT_SUBSCRIPTION_ADDRESS,
    topic: process.env.STATEMENT_TOPIC_ADDRESS,
    type: 'subscription'
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const processingSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.processingSubscription }
const submitSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.submitSubscription }
const returnSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.returnSubscription }
const statementSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.statementSubscription }

module.exports = {
  processingSubscription,
  submitSubscription,
  returnSubscription,
  statementSubscription
}
