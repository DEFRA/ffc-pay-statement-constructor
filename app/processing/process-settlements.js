const db = require('../../app/data')

const schema = require('./schema')

const getScheduledSettlements = require('./get-scheduled-settlements')
const updateScheduledSettlementsByScheduleId = require('./update-scheduled-settlements-by-schedule-ids')

const processScheduledSettlements = async (started = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledSettlements = await getScheduledSettlements(started, transaction)

    const validScheduledSettlements = []

    for (const scheduledSettlement of scheduledSettlements) {
      try {
        const result = schema.validate(scheduledSettlement, {
          abortEarly: false
        })

        if (result.error) {
          console.error(`Schedule with scheduleId: ${scheduledSettlements.scheduleId} does not have the required data: ${result.error.message}`)
        } else {
          validScheduledSettlements.push(result.value)
        }
      } catch (error) {
        console.error('Could not validate: ', scheduledSettlement)
      }
    }

    await updateScheduledSettlementsByScheduleId(validScheduledSettlements.map(x => x.scheduleId), started, transaction)
    await transaction.commit()

    return validScheduledSettlements
  } catch (error) {
    await transaction.rollback()
    console.error('Could not schedule settlements')
  }
}

module.exports = processScheduledSettlements
