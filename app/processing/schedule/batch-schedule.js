const db = require('../../data')

const getScheduledSettlements = require('./get-scheduled-settlements')
const validateSchedule = require('./validate-schedule')
const updateScheduledSettlementsByScheduleId = require('./update-scheduled-settlements-by-schedule-ids')

const batchSchedule = async (started = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledSettlements = await getScheduledSettlements(started, transaction)

    const validScheduledSettlements = []
    for (const scheduledSettlement of scheduledSettlements) {
      try {
        const a = validateSchedule(scheduledSettlement)
        validScheduledSettlements.push(a)
      } catch (err) {
        console.error(err)
      }
    }

    console.log(validScheduledSettlements)
    for (const [ind, validScheduledSettlement] of validScheduledSettlements.entries()) {
      try {
        await updateScheduledSettlementsByScheduleId(validScheduledSettlement.scheduleId, started, transaction)
      } catch (err) {
        console.error(`Could not update saved for: ${validScheduledSettlement.scheduleId}, removing from schedule`)
        validScheduledSettlements.splice(ind, 1)
      }
    }
    console.log(validScheduledSettlements)

    await transaction.commit()
    return validScheduledSettlements
  } catch {
    await transaction.rollback()
    console.error('Could not schedule settlements')
  }
}

module.exports = batchSchedule
