const moment = require('moment')
const getPaymentSchedule = require('./get-payment-schedule')

const getLatestPayment = (paymentRequest, settlement, lastSettlement) => {
  const lastSettlementValue = lastSettlement?.value ?? 0
  const paymentValue = settlement.value - lastSettlementValue

  return {
    invoiceNumber: settlement.invoiceNumber,
    reference: settlement.reference,
    dueDate: paymentRequest.dueDate,
    value: paymentValue,
    period: paymentRequest.schedule
      ? getPaymentSchedule(paymentRequest.schedule, paymentRequest.dueDate, paymentValue, settlement.value, lastSettlementValue, paymentRequest.value, settlement.settlementDate)
      : `${moment(paymentRequest.dueDate).format('MMMM YYYY')}`
  }
}

module.exports = getLatestPayment
