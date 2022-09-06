const schema = require('./fundings-schema')

const getFundingsByCalculationId = require('./get-fundings-by-calculation-id')

const getFundings = async (calculationId) => {
  const rawFundings = await getFundingsByCalculationId(calculationId)
  const result = schema.validate(rawFundings, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Calculation with calculationId: ${calculationId} does not have valid funding(s): ${result.error.message}`)
  }

  const fundings = rawFundings.map(rawFunding => ({
    area: rawFunding.areaClaimed,
    rate: rawFunding.rate
  }))

  return fundings
}

module.exports = getFundings
