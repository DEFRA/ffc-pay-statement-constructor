const db = require('../../data')

const getScheduledSettlements = require('./get-scheduled-settlements')
const validateSchedule = require('./validate-schedule')
const updateScheduledSettlementByScheduleId = require('./update-scheduled-settlement-by-schedule-id')

const batchSchedule = async (started = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledSettlements = await getScheduledSettlements(started, transaction)

    const validScheduledSettlements = []
    for (const scheduledSettlement of scheduledSettlements) {
      try {
        validScheduledSettlements.push(validateSchedule(scheduledSettlement))
      } catch (err) {
        console.error(err)
      }
    }

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
