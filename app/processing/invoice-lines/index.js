const schema = require('./invoice-line-schema')

const getInvoiceLinesByPaymentRequestId = require('./get-invoice-lines-by-payment-request-id')

const getInvoiceLines = async (paymentRequestId) => {
  const invoiceLines = await getInvoiceLinesByPaymentRequestId(paymentRequestId)

  invoiceLines.forEach(invoiceLine => {
    const result = schema.validate(invoiceLine, { abortEarly: false })
    if (result.error) {
      throw new Error(`Invoice line with paymentRequestId: ${paymentRequestId} does not have the required data: ${result.error.message}`)
    } else {
      console.log(`Valid invoice line: ${invoiceLine.description}`)
    }
  })

  return invoiceLines
}

module.exports = getInvoiceLines

// for each element of array
// validate
// if description is gross then add the value together
// return an object with total value
// how to pair a reduction to a payment?
