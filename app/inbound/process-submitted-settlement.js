const db = require('../data')
const saveSettlement = require('./save-settlement')

const processSubmittedSettlement = async (settlement) => {
  console.log(settlement)
  const transaction = await db.sequelize.transaction()

  try {
    await saveSettlement(settlement, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processSubmittedSettlement
