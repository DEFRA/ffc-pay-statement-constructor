const getCompletedPaymentRequestByInvoiceNumber = require('../get-completed-payment-request-by-invoice-number')
const updateCalculationPaymentRequestId = require('./update-calculation-payment-request-id')

const updateCalculation = async (invoiceNumber, calculationId, transaction) => {
  const existingCompletedPaymentRequest = await getCompletedPaymentRequestByInvoiceNumber(invoiceNumber)

  if (existingCompletedPaymentRequest) {
    await updateCalculationPaymentRequestId(existingCompletedPaymentRequest.paymentRequestId, calculationId, transaction)
  }
}

module.exports = updateCalculation
