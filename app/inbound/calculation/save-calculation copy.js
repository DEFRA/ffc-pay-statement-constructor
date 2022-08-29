const db = require('../../data')

const saveCalculation = async (calculation, transaction) => {
  await db.calculation.create(calculation, { transaction })
}

module.exports = saveCalculation
