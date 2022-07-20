const config = require('../config')
const processProcessingMessage = require('./process-processing-message')
const processSubmitMessage = require('./process-submit-message')
const processReturnMessage = require('./process-return-message')
const { MessageReceiver } = require('ffc-messaging')
let processingReceiver
let submitReceiver
let returnReceiver

const start = async () => {
  const processingAction = message => processProcessingMessage(message, processingReceiver)
  processingReceiver = new MessageReceiver(config.processingSubscription, processingAction)
  await processingReceiver.subscribe()

  const submitAction = message => processSubmitMessage(message, submitReceiver)
  submitReceiver = new MessageReceiver(config.submitSubscription, submitAction)
  await submitReceiver.subscribe()

  const returnAction = message => processReturnMessage(message, returnReceiver)
  returnReceiver = new MessageReceiver(config.returnSubscription, returnAction)
  await returnReceiver.subscribe()

  console.info('Ready to receive payment updates')
}

const stop = async () => {
  await processingReceiver.closeConnection()
  await submitReceiver.closeConnection()
  await returnReceiver.closeConnection()
}

module.exports = { start, stop }
