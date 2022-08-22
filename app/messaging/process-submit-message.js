const util = require('util')
const { processSubmitPaymentRequest } = require('../inbound')

const processSubmitMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Payment request submitted:', util.inspect(paymentRequest, false, null, true))
    await processSubmitPaymentRequest(paymentRequest)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process submit message:', err)
  }
}

module.exports = processSubmitMessage
