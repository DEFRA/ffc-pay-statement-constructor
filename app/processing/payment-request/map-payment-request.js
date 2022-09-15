const { NAMES } = require('../../constants/schedules')

const mapPaymentRequest = async (paymentRequest) => {
  const year = paymentRequest.marketingYear
  const frequency = NAMES[paymentRequest.schedule] ?? NAMES.Q4

  return {
    paymentRequestId: paymentRequest.paymentRequestId,
    agreementNumber: paymentRequest.agreementNumber,
    dueDate: paymentRequest.dueDate,
    frequency,
    value: paymentRequest.value,
    year
  }
}

module.exports = mapPaymentRequest
