const schema = require('./schema')

const validateInvoiceLine = (grossValueInvoiceLine, fundingCode, paymentRequestId) => {
  const result = schema.validate(grossValueInvoiceLine, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required gross invoice-line data for funding code ${fundingCode} : ${result.error.message}`)
  }

  return result.value
}

module.exports = validateInvoiceLine
