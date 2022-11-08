const db = require('../../data')
const getCompletedPaymentRequestByInvoiceNumber = require('../get-completed-payment-request-by-invoice-number')

const saveSettlement = async (settlement, transaction) => {
  const matchedPaymentRequest = await getCompletedPaymentRequestByInvoiceNumber(settlement.invoiceNumber, transaction)
  settlement.paymentRequestId = (matchedPaymentRequest ? matchedPaymentRequest?.paymentRequestId : null) ?? null
  return db.settlement.create(settlement, { transaction })
}

module.exports = saveSettlement
