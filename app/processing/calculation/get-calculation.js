const schema = require('./calculation-schema')

const getCalculationByPaymentRequestId = require('./get-calculation-by-payment-request-id')

const getCalculation = async (paymentRequestId) => {
  const calculation = await getCalculationByPaymentRequestId(paymentRequestId)
  const result = schema.validate(calculation, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required Calculation data: ${result.error.message}`)
  }

  return {
    calculationId: calculation.calculationId,
    sbi: calculation.sbi,
    calculated: calculation.calculationDate,
    invoiceNumber: calculation.invoiceNumber
  }
}

module.exports = getCalculation
