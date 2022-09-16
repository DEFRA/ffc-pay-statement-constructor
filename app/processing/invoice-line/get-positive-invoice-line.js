const schema = require('./invoice-line-schema')

const getPositiveInvoiceLineByFundingCodeAndPaymentRequestId = require('./get-positive-invoice-line-by-funding-code-and-payment-request-id')

const getPositiveInvoiceLine = async (fundingCode, paymentRequestId) => {
  const invoiceLine = await getPositiveInvoiceLineByFundingCodeAndPaymentRequestId(fundingCode, paymentRequestId)
  const result = schema.validate(invoiceLine, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required invoice-line data for funding code ${fundingCode} : ${result.error.message}`)
  }

  const quarter = 0.25
  const minPaymentValue = 0
  const defaultReductionValue = 0
  const annualValue = invoiceLine.value
  const quarterlyValue = annualValue > minPaymentValue ? Math.trunc(annualValue * quarter) : minPaymentValue
  const quarterlyReduction = defaultReductionValue
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

module.exports = getPositiveInvoiceLine
