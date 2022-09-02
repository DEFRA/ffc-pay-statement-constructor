const getInvoiceLinesByPaymentRequestId = require('./get-invoice-lines-by-payment-request-id')
const validateInvoiceLines = require('./validate-invoice-lines')
const mapInvoiceLines = require('./map-invoice-lines')

const getInvoiceLines = async (paymentRequestId) => {
  const invoiceLines = await getInvoiceLinesByPaymentRequestId(paymentRequestId)
  validateInvoiceLines(invoiceLines, paymentRequestId)
  return mapInvoiceLines(invoiceLines)
}

module.exports = getInvoiceLines
