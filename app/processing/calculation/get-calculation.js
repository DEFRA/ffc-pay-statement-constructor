const schema = require('./calculation-schema')

const getCalculationByPaymentRequestId = require('./get-calculation-by-payment-request-id')
const updateCalculationPaymentRequestId = require('./update-calculation-payment-request-id')

const getCalculation = async (paymentRequestId, invoiceNumber, transaction) => {
  const rawCalculation = await getCalculationByPaymentRequestId(paymentRequestId, transaction)
  const calculation = rawCalculation || await updateCalculationPaymentRequestId(invoiceNumber, paymentRequestId, transaction)

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
    invoiceNumber: calculation.invoiceNumber,
    paymentRequestId: calculation.paymentRequestId
  }
}

module.exports = getCalculation
