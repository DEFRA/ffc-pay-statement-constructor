const processPaymentRequest = require('./process-payment-request')

const processSubmitPaymentRequest = async (paymentRequest) => {
  await processPaymentRequest(paymentRequest)
}

module.exports = processSubmitPaymentRequest
