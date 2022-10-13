
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
    value: convertToPounds(Math.trunc(paymentRequest.value / 4))
  }
  payments.push(payment)

  return payments
}

const formatDate = (dateVal) => {
  return moment(dateVal, ['DD/MM/YYYY', 'ddd MMM DD YYYY HH:mm:ss']).format('D MMMM YYYY')
}
// 'Tue Feb 08 2022 00:00:00 GMT+0000 (Greenwich Mean Time)' 'ddd MMM DD YYYY HH:mm:ss'

module.exports = getDetailedPayments
