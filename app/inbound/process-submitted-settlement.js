const db = require('../data')
const saveSettlement = require('./save-settlement')
const getExistingSettlement = require('./get-existing-settlement')

const processSubmittedSettlement = async (settlement) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingSettlement = await getExistingSettlement(settlement, transaction)
    if (existingSettlement) {
      console.info(`Duplicate settlement received, skipping ${existingSettlement.reference}`)
      await transaction.rollback()
    } else {
      await saveSettlement(settlement, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processSubmittedSettlement
