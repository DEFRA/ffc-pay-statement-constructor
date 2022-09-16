const schema = require('./invoice-line-schema')

const getPositiveInvoiceLineByFundingCodeAndPaymentRequestId = require('./get-positive-invoice-line-by-funding-code-and-payment-request-id')

const QUARTER = 0.25
const MIN_PAYMENT_VALUE = 0
const DEFAULT_REDUCTION_VALUE = 0

const getPositiveInvoiceLine = async (fundingCode, paymentRequestId) => {
  const invoiceLine = await getPositiveInvoiceLineByFundingCodeAndPaymentRequestId(fundingCode, paymentRequestId)
  const result = schema.validate(invoiceLine, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required invoice-line data for funding code ${fundingCode} : ${result.error.message}`)
  }

  const annualValue = invoiceLine.value
  const quarterlyValue = annualValue > MIN_PAYMENT_VALUE ? Math.trunc(annualValue * QUARTER) : MIN_PAYMENT_VALUE
  const quarterlyReduction = DEFAULT_REDUCTION_VALUE
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
