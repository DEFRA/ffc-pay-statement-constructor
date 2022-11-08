const getCompletedPaymentRequestByPaymentRequestId = require('./get-completed-payment-request-by-payment-request-id')
const getInProgressPaymentRequestByReferenceId = require('./get-in-progress-payment-request-by-reference-id')
const validatePaymentRequest = require('./validate-payment-request')
const mapPaymentRequest = require('./map-payment-request')

const getPaymentRequest = async (paymentRequestId, transaction) => {
  const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId, transaction)
  const inProgressPaymentRequest = await getInProgressPaymentRequestByReferenceId(completedPaymentRequest.referenceId, transaction)
  return mapPaymentRequest(validatePaymentRequest(inProgressPaymentRequest))
}

module.exports = getPaymentRequest
