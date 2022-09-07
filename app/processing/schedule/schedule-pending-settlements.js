const db = require('../../data')

const getScheduledSettlements = require('./get-scheduled-settlements')
const getValidScheduledSettlements = require('./get-valid-scheduled-settlements')
const getUpdatedScheduledSettlements = require('./get-updated-scheduled-settlements')

const schedulePendingSettlements = async () => {
  const started = new Date()
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledSettlements = await getScheduledSettlements(started, transaction)
    const validScheduledSettlements = getValidScheduledSettlements(scheduledSettlements)
    const updatedScheduledSettlements = await getUpdatedScheduledSettlements(validScheduledSettlements, started, transaction)
    await transaction.commit()
    return updatedScheduledSettlements
  } catch (err) {
    await transaction.rollback()
    console.error('Could not schedule settlements', err)
    return []
  }
}

module.exports = schedulePendingSettlements
