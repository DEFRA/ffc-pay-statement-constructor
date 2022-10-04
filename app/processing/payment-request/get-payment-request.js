const getCompletedPaymentRequestByPaymentRequestId = require('./get-completed-payment-request-by-payment-request-id')
const validatePaymentRequest = require('./validate-payment-request')
const mapPaymentRequest = require('./map-payment-request')

const getPaymentRequest = async (paymentRequestId, transaction) => {
  const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId, transaction)
  return mapPaymentRequest(validatePaymentRequest(completedPaymentRequest))
}

module.exports = getPaymentRequest
