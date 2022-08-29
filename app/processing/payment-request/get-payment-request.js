const schema = require('./payment-request-schema')

const getCompletedPaymentRequestByPaymentRequestId = require('./get-completed-payment-request-by-payment-request-id')
const mapPaymentRequest = require('./map-payment-request')

const getPaymentRequest = async (paymentRequestId) => {
  const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId)
  const result = schema.validate(completedPaymentRequest, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required data: ${result.error.message}`)
  }

  return mapPaymentRequest(result.value)
}

module.exports = getPaymentRequest
