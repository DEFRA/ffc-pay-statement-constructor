const db = require('../data')
const getPayementRequestbyInvoiceNumber = require('./get-payment-request-by-invoice-number')

const saveSettlement = async (settlement, transaction) => {
  const matchedPaymentRequest = await getPayementRequestbyInvoiceNumber(settlement)
  if (matchedPaymentRequest) {
    settlement.paymentRequestId = matchedPaymentRequest.paymentRequestId
    await db.settlement.create(settlement, { transaction })
  } else {
    console.error(`Settlement could not be matched to paymentRequest with invoiceNumber: ${settlement.invoiceNumber}`)
    throw new Error('Settlement could not be matched to paymentRequest')
  }
}

module.exports = saveSettlement
