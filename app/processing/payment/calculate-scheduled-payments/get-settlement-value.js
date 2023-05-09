const getSettledValue = (previousSettlements) => {
  return previousSettlements.reduce((first, settlement) => Math.max(first, settlement.value), Number.NEGATIVE_INFINITY)
}

module.exports = getSettledValue
