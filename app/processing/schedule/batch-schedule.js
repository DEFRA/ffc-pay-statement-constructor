const db = require('../../data')

const getScheduledSettlements = require('./get-scheduled-settlements')
const validateScheduledSettlement = require('./validate-scheduled-settlement')
const updateScheduledSettlementsByScheduleId = require('./update-scheduled-settlements-by-schedule-ids')

const batchSchedule = async (started = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledSettlements = await getScheduledSettlements(started, transaction)

    const validScheduledSettlements = []
    for (const scheduledSettlement of scheduledSettlements) {
      try {
        const a = validateScheduledSettlement(scheduledSettlement)
        validScheduledSettlements.push(a)
      } catch (err) {
        console.error(err)
      }
    }

    for (const [ind, validScheduledSettlement] of validScheduledSettlements.entries()) {
      try {
        await updateScheduledSettlementsByScheduleId(validScheduledSettlement.scheduleId, started, transaction)
      } catch (err) {
        console.error(`Could not update saved for: ${validScheduledSettlement.scheduleId}, removing from schedule`)
        validScheduledSettlements.splice(ind, 1)
      }
    }

    await transaction.commit()
    return validScheduledSettlements
  } catch {
    await transaction.rollback()
    console.error('Could not schedule settlements')
  }
}

module.exports = batchSchedule
