const moment = require('moment')
const getPaymentSchedule = require('./get-payment-schedule')
const validateLatestPayment = require('./validate-latest-payment')

const getLatestPayment = (paymentRequest, settlement, supportingSettlements) => {
  const supportingPaymentValue = supportingSettlements?.reduce((total, settlement) => total + settlement.paymentValue, 0) ?? 0
  const adjustedPaymentValue = settlement.paymentValue + supportingPaymentValue

  const supportingPaymentLastSettlementValues = supportingSettlements?.reduce((total, settlement) => total + settlement.lastSettlementValue, 0) ?? 0
  const adjustedLastSettlementValue = settlement.lastSettlementValue + supportingPaymentLastSettlementValues

  const latestPayment = {
    invoiceNumber: settlement.invoiceNumber,
    dueDate: paymentRequest.dueDate,
    value: adjustedPaymentValue,
    period: paymentRequest.schedule
      ? getPaymentSchedule(paymentRequest.schedule, paymentRequest.dueDate, adjustedPaymentValue, settlement.value, adjustedLastSettlementValue, paymentRequest.value, settlement.settlementDate)
      : `${moment(paymentRequest.dueDate).format('MMMM YYYY')}`
  }

  return validateLatestPayment(latestPayment)
}

module.exports = getLatestPayment
