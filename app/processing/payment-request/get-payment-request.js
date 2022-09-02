const getCompletedPaymentRequestByPaymentRequestId = require('./get-completed-payment-request-by-payment-request-id')
const validatePaymentRequest = require('./validate-payment-request')
const mapPaymentRequest = require('./map-payment-request')

const getPaymentRequest = async (paymentRequestId) => {
  const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId)
  return mapPaymentRequest(validatePaymentRequest(completedPaymentRequest))
}

module.exports = getPaymentRequest
