const db = require('../../data')

const getSettledSettlementBySettlementId = async (settlementId, transaction) => {
  return db.settlement.findOne({
    transaction,
    attributes: [
      'paymentRequestId',
      'reference',
      'settled'
    ],
    where: {
      settlementId,
      settled: true
    },
    raw: true
  })
}

module.exports = getSettledSettlementBySettlementId
