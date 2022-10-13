const schema = require('./invoice-line-schema')

const getPositiveInvoiceLineByFundingCodeAndPaymentRequestId = require('./get-positive-invoice-line-by-funding-code-and-payment-request-id')
const getReductions = require('./get-reductions')

const QUARTER = 0.25
const MIN_PAYMENT_VALUE = 0

const getInvoiceLine = async (fundingCode, paymentRequestId) => {
  const grossValueInvoiceLine = await getPositiveInvoiceLineByFundingCodeAndPaymentRequestId(fundingCode, paymentRequestId)
  const result = schema.validate(grossValueInvoiceLine, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required gross invoice-line data for funding code ${fundingCode} : ${result.error.message}`)
  }

  const { reductions, annualReduction } = await getReductions(fundingCode, paymentRequestId)
  const annualValue = grossValueInvoiceLine.value
  const quarterlyValue = annualValue > MIN_PAYMENT_VALUE ? Math.trunc(annualValue * QUARTER) : MIN_PAYMENT_VALUE
  const quarterlyReduction = Math.trunc(annualReduction * QUARTER)
  const quarterlyPayment = quarterlyValue - quarterlyReduction

  return {
    annualValue,
    quarterlyValue,
    quarterlyReduction,
    quarterlyPayment,
    reductions
  }
}

module.exports = getInvoiceLine
