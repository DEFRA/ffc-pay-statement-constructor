const schema = require('./invoice-line-schema')

const getInvoiceLineByFundingCodeAndPaymentId = require('./get-invoice-line-by-funding-code-and-payment-id')

const getInvoiceLine = async (fundingCode, paymentRequestId) => {
  const invoiceline = await getInvoiceLineByFundingCodeAndPaymentId(fundingCode, paymentRequestId)
  const result = schema.validate(invoiceline, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required invoice-line data for funding code ${fundingCode} : ${result.error.message}`)
  }

  const annualValue = invoiceline.value
  const quarterlyValue = annualValue > 0 ? annualValue / 4 : 0
  const quarterlyReduction = 0
  const quarterlyPayment = quarterlyValue - quarterlyReduction
  const reductions = []

  return {
    annualValue,
    quarterlyValue,
    quarterlyReduction,
    quarterlyPayment,
    reductions
  }
}

module.exports = getInvoiceLine
