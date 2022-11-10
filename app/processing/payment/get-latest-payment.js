const moment = require('moment')
const getPaymentSchedule = require('./get-payment-schedule')
const validateLatestPayment = require('./validate-latest-payment')

const getLatestPayment = (paymentRequest, settlement, lastSettlement, supportingSettlements) => {
  const lastSettlementValue = lastSettlement?.value ?? 0
  const paymentValue = settlement.value - lastSettlementValue
  const supportingPaymentValue = supportingSettlements?.reduce((total, settlement) => total + settlement.value, 0) ?? 0
  const adjustedPaymentValue = paymentValue + supportingPaymentValue

  const latestPayment = {
    invoiceNumber: settlement.invoiceNumber,
    dueDate: paymentRequest.dueDate,
    value: adjustedPaymentValue,
    period: paymentRequest.schedule
      ? getPaymentSchedule(paymentRequest.schedule, paymentRequest.dueDate, paymentValue, settlement.value, lastSettlementValue, paymentRequest.value, settlement.settlementDate)
      : `${moment(paymentRequest.dueDate).format('MMMM YYYY')}`
  }

  return validateLatestPayment(latestPayment)
}

module.exports = getLatestPayment
