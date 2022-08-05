const db = require('../data')
const getPaymentRequestByInvoiceNumber = require('./get-payment-request-by-invoice-number')

const saveSettlement = async (settlement, transaction) => {
  const invoiceNumber = settlement.invoiceNumber
  const paymentRequest = await getPaymentRequestByInvoiceNumber(invoiceNumber, transaction)
  settlement.paymentRequestId = paymentRequest.paymentRequestId
  settlement.schemeId = paymentRequest.schemeId

  await db.settlement.create({ ...settlement }, { transaction })
}

module.exports = saveSettlement

// set the missing fields
// hard code first
// then use the invoice number to find them from other tables
