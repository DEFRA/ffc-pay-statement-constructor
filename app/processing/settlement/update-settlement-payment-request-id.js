const db = require('../../data')
const getCompletedPaymentRequestByInvoiceNumber = require('./get-completed-payment-request-by-invoice-number')

const updateSettlementPaymentRequestId = async (settlement, transaction) => {
  const paymentRequest = await getCompletedPaymentRequestByInvoiceNumber(settlement.invoiceNumber)

  if (paymentRequest) {
    const { paymentRequestId } = paymentRequest
    await db.settlement.update({ paymentRequestId }, {
      transaction,
      lock: true,
      where: {
        settlementId: settlement.settlementId
      }
    })

    settlement.paymentRequestId = paymentRequestId
  }

  return settlement
}

module.exports = updateSettlementPaymentRequestId
