const db = require('../../data')

const getFundingsByCalculationId = async (calculationId) => {
  return db.funding.findAll({
    attributes: [
      'calculationId',
      'areaClaimed',
      'rate'
    ],
    include: [{
      model: db.fundingOption,
      as: 'fundingOptions',
      attributes: ['name']
    }],
    where: {
      calculationId
    },
    raw: true
  })
}

module.exports = getFundingsByCalculationId
