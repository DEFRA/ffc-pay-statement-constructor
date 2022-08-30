const db = require('../../data')

const getCalculationBySbi = async (sbi, transaction) => {
  return db.organisation.findOne({
    transaction,
    where: {
      sbi
    }
  })
}

module.exports = getCalculationBySbi
