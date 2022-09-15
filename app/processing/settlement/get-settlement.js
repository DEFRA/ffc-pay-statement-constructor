const getSettledSettlementBySettlementId = require('./get-settled-settlement-by-settlement-id')
const validateSettlement = require('./validate-settlement')
const updateSettlementPaymentRequestId = require('./update-settlement-payment-request-id')

const getSettlement = async (settlementId, transaction) => {
  const settledSettlement = await getSettledSettlementBySettlementId(settlementId, transaction)
  const settledSettlementWithPaymentRequestId = settledSettlement.paymentRequestId ? settledSettlement : await updateSettlementPaymentRequestId(settledSettlement)

  return validateSettlement(settledSettlementWithPaymentRequestId)
}

module.exports = getSettlement
