
const getInvoiceLinesByPaymentRequestId = require('./get-invoice-lines-by-payment-request-id')
const validateInvoiceLines = require('./validate-invoice-lines')
const mapInvoiceLines = require('./map-invoice-lines')

const getInvoiceLines = async (paymentRequestId) => {
  const invoiceLines = await getInvoiceLinesByPaymentRequestId(paymentRequestId)
  validateInvoiceLines(invoiceLines, paymentRequestId)
  mapInvoiceLines(invoiceLines)
}

module.exports = getInvoiceLines

// for each element of array
// validate
// if description is gross then add the value together
// return an object with total value
// how to pair a reduction to a payment?
