const schema = require('./schema')

const getSettledSettlementBySettlementId = require('./get-settled-settlement-by-settlement-id')

const getSettlement = async (settlementId) => {
  const settledSettlement = await getSettledSettlementBySettlementId(settlementId)
  const result = schema.validate(settledSettlement, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Settlement with settlementId: ${settlementId} does not have the required data: ${result.error.message}`)
  }

  return result.value
}

module.exports = getSettlement
