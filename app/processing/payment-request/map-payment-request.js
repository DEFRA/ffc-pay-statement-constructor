const { NAMES } = require('../../constants/schedules')

const mapPaymentRequest = (paymentRequest) => {
  const year = paymentRequest.marketingYear
  const frequency = NAMES[paymentRequest.schedule] ?? NAMES.N0

  return {
    paymentRequestId: paymentRequest.paymentRequestId,
    agreementNumber: paymentRequest.agreementNumber,
    dueDate: paymentRequest.dueDate,
    frequency,
    invoiceNumber: paymentRequest.invoiceNumber,
    value: paymentRequest.value,
    year,
    schedule: paymentRequest.schedule
  }
}

module.exports = mapPaymentRequest
