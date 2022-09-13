
const moment = require('moment')
const { convertToPounds } = require('../../../utility')

const getDetailedPayments = async (calculation, paymentRequest, settlement) => {
  const payments = []

  const payment = {
    invoiceNumber: calculation.invoiceNumber,
    reference: settlement.reference,
    dueDate: formatDate(paymentRequest.dueDate),
    settled: formatDate(settlement.settlementDate),
    calculated: formatDate(calculation.calculated),
    value: convertToPounds(paymentRequest.value)
  }
  payments.push(payment)

  return payments
}

const formatDate = (dateVal) => {
  return moment(dateVal).format('D MMMM YYYY')
}

module.exports = getDetailedPayments
