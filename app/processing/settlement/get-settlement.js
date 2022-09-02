const getSettledSettlementBySettlementId = require('./get-settled-settlement-by-settlement-id')
const validateSettlement = require('./validate-settlement')

const getSettlement = async (settlementId) => {
  const settledSettlement = await getSettledSettlementBySettlementId(settlementId)
  return validateSettlement(settledSettlement)
}

module.exports = getSettlement
