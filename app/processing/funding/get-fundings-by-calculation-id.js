const db = require('../../data')

const getFundingsByCalculationId = async (calculationId) => {
  return db.funding.findAll({
    attributes: [
      'calculationId',
      'areaClaimed',
      'rate'
    ],
    where: {
      calculationId
    },
    raw: true
  })
}

module.exports = getFundingsByCalculationId
