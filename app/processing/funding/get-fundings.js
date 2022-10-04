const schema = require('./fundings-schema')
const mapFundings = require('./map-fundings')

const getFundingsByCalculationId = require('./get-fundings-by-calculation-id')

const getFundings = async (calculationId, transaction) => {
  const rawFundings = await getFundingsByCalculationId(calculationId, transaction)
  const fundings = await mapFundings(rawFundings)

  const result = schema.validate(fundings, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Calculation with calculationId: ${calculationId} does not have valid funding(s): ${result.error.message}`)
  }

  return fundings
}

module.exports = getFundings
