const schema = require('./invoice-line-schema')

const getInvoiceLineByPaymentRequestId = require('./get-invoice-line-by-payment-request-id')

const getInvoiceLines = async (paymentRequestId) => {
  // this now returns an array
  const invoiceLine = await getInvoiceLineByPaymentRequestId(paymentRequestId)
  const result = schema.validate(invoiceLine[0], {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Invoice line with paymentRequestId: ${paymentRequestId} does not have the required data: ${result.error.message}`)
  }

  return invoiceLine
}

module.exports = getInvoiceLines
