const db = require('../../data')

const getSettledSettlementBySettlementId = async (settlementId, transaction) => {
  return db.settlement.findOne({
    transaction,
    attributes: [
      'paymentRequestId',
      'invoiceNumber',
      'reference',
      'settled',
      'settlementDate'
    ],
    where: {
      settlementId,
      settled: true
    },
    raw: true
  })
}

module.exports = getSettledSettlementBySettlementId
