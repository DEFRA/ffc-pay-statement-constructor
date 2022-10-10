
const moment = require('moment')
const { convertToPounds } = require('../../../utility')

const getDetailedPayments = async (calculation, latestPayment, settlement) => {
  const payments = []

  const payment = {
    invoiceNumber: calculation.invoiceNumber,
    reference: settlement.reference,
    dueDate: formatDate(latestPayment.dueDate),
    settled: formatDate(settlement.settlementDate),
    calculated: formatDate(calculation.calculated),
    value: convertToPounds(latestPayment.value),
    period: latestPayment.period
  }
  payments.push(payment)

  return payments
}

const formatDate = (dateVal) => {
  return moment(dateVal).format('D MMMM YYYY')
}

module.exports = getDetailedPayments
