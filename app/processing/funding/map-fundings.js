const getFundingLevel = require('./get-funding-level')
const getFundingName = require('./get-funding-name')

const mapFundings = (rawFundings) => {
  const fundings = rawFundings.map(rawFunding => ({
    area: rawFunding.areaClaimed,
    fundingCode: rawFunding.fundingCode,
    level: getFundingLevel(rawFunding.fundingOptions.name),
    name: getFundingName(rawFunding.fundingOptions.name),
    rate: rawFunding.rate
  }))

  return fundings
}

module.exports = mapFundings
