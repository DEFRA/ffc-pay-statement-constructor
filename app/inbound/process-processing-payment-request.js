const processPaymentRequest = require('./process-payment-request')

const processProcessingPaymentRequest = async (paymentRequest) => {
  await processPaymentRequest(paymentRequest)
}

module.exports = processProcessingPaymentRequest
