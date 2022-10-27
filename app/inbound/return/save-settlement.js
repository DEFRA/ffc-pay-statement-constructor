const db = require('../../data')
const getCompletedPaymentRequestbyInvoiceNumber = require('../get-completed-payment-request-by-invoice-number')

const saveSettlement = async (settlement, transaction) => {
  const matchedPaymentRequest = await getCompletedPaymentRequestbyInvoiceNumber(settlement.invoiceNumber, transaction)
  settlement.paymentRequestId = (matchedPaymentRequest ? matchedPaymentRequest?.paymentRequestId : null) ?? null
  return db.settlement.create(settlement, { transaction })
}

module.exports = saveSettlement
