const moment = require('moment')
const getPaymentSchedule = require('./get-payment-schedule')
const validateLatestPayment = require('./validate-latest-payment')

const getLatestPayment = (paymentRequest, settlement, lastSettlement) => {
  const lastSettlementValue = lastSettlement?.value ?? 0
  const paymentValue = settlement.value - lastSettlementValue

  const latestPayment = {
    invoiceNumber: settlement.invoiceNumber,
    dueDate: paymentRequest.dueDate,
    value: paymentValue,
    period: paymentRequest.schedule
      ? getPaymentSchedule(paymentRequest.schedule, paymentRequest.dueDate, paymentValue, settlement.value, lastSettlementValue, paymentRequest.value, settlement.settlementDate)
      : `${moment(paymentRequest.dueDate).format('MMMM YYYY')}`
  }

  return validateLatestPayment(latestPayment)
}

module.exports = getLatestPayment
