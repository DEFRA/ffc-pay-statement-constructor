const schema = require('./schema')

const validateInvoiceLines = (invoiceLines, paymentRequestId) => {
  invoiceLines.forEach(invoiceLine => {
    const result = schema.validate(invoiceLine, { abortEarly: false })
    if (result.error) {
      throw new Error(`Invoice line with paymentRequestId: ${paymentRequestId} does not have the required data: ${result.error.message}`)
    }
  })
}

module.exports = validateInvoiceLines
