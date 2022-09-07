const { NAMES } = require('../../constants/schedules')

const mapPaymentRequest = async (paymentRequest) => {
  const year = paymentRequest.marketingYear
  const frequency = NAMES[paymentRequest.schedule] ?? NAMES.Q4

  return {
    paymentRequestId: paymentRequest.paymentRequestId,
    dueDate: paymentRequest.dueDate,
    frequency,
    year
  }
}

module.exports = mapPaymentRequest
