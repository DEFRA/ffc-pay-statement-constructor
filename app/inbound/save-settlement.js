const db = require('../data')

const saveSettlement = async (settlement, transaction) => {
  await db.settlement.create({ ...settlement }, { transaction })
}

module.exports = saveSettlement
