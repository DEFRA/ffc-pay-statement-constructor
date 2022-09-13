const db = require('../../data')
const getCompletedPaymentRequestByReversedInvoiceNumber = require('./get-completed-payment-request-by-reversed-invoice-number')

const updateCalculationPaymentRequestId = async (calculation, transaction) => {
  const paymentRequest = await getCompletedPaymentRequestByReversedInvoiceNumber(calculation.invoiceNumber)

  if (paymentRequest) {
    const { paymentRequestId } = paymentRequest
    await db.calculation.update({ paymentRequestId }, {
      transaction,
      lock: true,
      where: {
        calculationId: calculation.calculationId
      }
    })

    calculation.paymentRequestId = paymentRequestId
  }

  return calculation
}

module.exports = updateCalculationPaymentRequestId
