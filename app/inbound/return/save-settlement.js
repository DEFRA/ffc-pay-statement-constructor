const db = require('../../data')
const getPaymentRequestbyInvoiceNumber = require('./get-payment-request-by-invoice-number')

const saveSettlement = async (settlement, transaction) => {
  const matchedPaymentRequest = await getPaymentRequestbyInvoiceNumber(settlement.invoiceNumber, transaction)
  settlement.paymentRequestId = (matchedPaymentRequest ? matchedPaymentRequest?.paymentRequestId : null) ?? null
  await db.settlement.create(settlement, { transaction })
}

module.exports = saveSettlement
