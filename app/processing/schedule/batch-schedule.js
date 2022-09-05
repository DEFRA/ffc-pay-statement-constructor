const db = require('../../data')

const getScheduledSettlements = require('./get-scheduled-settlements')
const getValidScheduledSettlements = require('./get-valid-scheduled-settlements')
const updateScheduledSettlementByScheduleId = require('./update-scheduled-settlement-by-schedule-id')

const batchSchedule = async () => {
  const started = new Date()
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledSettlements = await getScheduledSettlements(started, transaction)

    const validScheduledSettlements = getValidScheduledSettlements(scheduledSettlements)

    const updatedScheduledSettlements = []
    for (const validScheduledSettlement of validScheduledSettlements) {
      try {
        await updateScheduledSettlementByScheduleId(validScheduledSettlement.scheduleId, started, transaction)
        updatedScheduledSettlements.push(validScheduledSettlement)
      } catch (err) {
        console.error(`Could not update saved for: ${validScheduledSettlement.scheduleId}, removing from schedule`)
      }
    }

    await transaction.commit()
    return updatedScheduledSettlements
  } catch {
    await transaction.rollback()
    console.error('Could not schedule settlements')
  }
}

module.exports = batchSchedule
