const getInvoiceLineByPaymentRequestId = require('./get-invoice-line-by-payment-request-id')

const getInvoiceLines = async (paymentRequestId) => {
  return getInvoiceLineByPaymentRequestId(paymentRequestId)
}

module.exports = getInvoiceLines
