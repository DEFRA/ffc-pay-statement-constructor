const getCompletedPaymentRequestByPaymentRequestId = require('./get-completed-payment-request-by-payment-request-id')
const getInProgressPaymentRequest = require('./get-in-progress-payment-request')
const getLatestCompletedPaymentRequest = require('./get-latest-completed-payment-request')
const validatePaymentRequest = require('./validate-payment-request')
const mapPaymentRequest = require('./map-payment-request')

const getPaymentRequest = async (paymentRequestId, transaction) => {
  const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId, transaction)
  const inProgressPaymentRequest = await getInProgressPaymentRequest(completedPaymentRequest.agreementNumber, completedPaymentRequest.marketingYear, completedPaymentRequest.paymentRequestNumber, transaction)
  const latestCompletedPaymentRequest = await getLatestCompletedPaymentRequest(inProgressPaymentRequest.agreementNumber, inProgressPaymentRequest.marketingYear, transaction)
  const latestInProgressPaymentRequest = await getInProgressPaymentRequest(latestCompletedPaymentRequest.agreementNumber, latestCompletedPaymentRequest.marketingYear, latestCompletedPaymentRequest.paymentRequestNumber, transaction)
  validatePaymentRequest(latestInProgressPaymentRequest)
  return mapPaymentRequest(latestInProgressPaymentRequest)
}

module.exports = getPaymentRequest
