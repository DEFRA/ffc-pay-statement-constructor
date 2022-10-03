const db = require('../../data')
const getPaymentRequestbyInvoiceNumber = require('./get-payment-request-by-invoice-number')

const saveSettlement = async (settlement, transaction) => {
  const matchedPaymentRequest = await getPaymentRequestbyInvoiceNumber(settlement.invoiceNumber, transaction)
  settlement.paymentRequestId = (matchedPaymentRequest ? matchedPaymentRequest?.paymentRequestId : null) ?? null
  const savedSettlement = await db.settlement.create(settlement, { transaction })
  await db.schedule.create({ settlementId: savedSettlement.settlementId }, { transaction })
}

module.exports = saveSettlement
