const schema = require('./invoice-line-schema')

const getPositiveInvoiceLineByFundingCodeAndPaymentRequestId = require('./get-positive-invoice-line-by-funding-code-and-payment-request-id')
const getNegativeInvoiceLinesByFundingCodeAndPaymentRequestId = require('./get-negative-invoice-lines-by-funding-code-and-payment-request-id')

const QUARTER = 0.25
const MIN_PAYMENT_VALUE = 0

const getInvoiceLine = async (fundingCode, paymentRequestId) => {
  const grossValueInvoiceLine = await getPositiveInvoiceLineByFundingCodeAndPaymentRequestId(fundingCode, paymentRequestId)
  const result = schema.validate(grossValueInvoiceLine, {
    abortEarly: false
  })

  console.log(result)

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required gross invoice-line data for funding code ${fundingCode} : ${result.error?.message ?? result.error}`)
  }

  const reductions = []
  let annualReduction = 0
  const reductionInvoiceLines = await getNegativeInvoiceLinesByFundingCodeAndPaymentRequestId(fundingCode, paymentRequestId)
  for (const reductionInvoiceLine of reductionInvoiceLines) {
    const reductionResult = schema.validate(reductionInvoiceLine, {
      abortEarly: false
    })
    if (reductionResult.error) {
      throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required reduction invoice-line data for funding code ${fundingCode} : ${result.error?.message ?? result.error}`)
    }
    reductions.push({
      reason: reductionInvoiceLine.description,
      value: reductionInvoiceLine.value
    })
    annualReduction += reductionInvoiceLine.value
  }

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
