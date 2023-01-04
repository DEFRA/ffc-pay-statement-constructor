const getCompletedPaymentRequestByPaymentRequestId = require('./get-completed-payment-request-by-payment-request-id')
const getInProgressPaymentRequest = require('./get-in-progress-payment-request')
const validatePaymentRequest = require('./validate-payment-request')
const mapPaymentRequest = require('./map-payment-request')

const getInProgressPaymentRequestFromCompleted = async (paymentRequestId, transaction) => {
  const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId, transaction)
  const inProgressPaymentRequest = await getInProgressPaymentRequest(completedPaymentRequest.correlationId, transaction)
  return mapPaymentRequest(validatePaymentRequest(inProgressPaymentRequest))
}

module.exports = getInProgressPaymentRequestFromCompleted
