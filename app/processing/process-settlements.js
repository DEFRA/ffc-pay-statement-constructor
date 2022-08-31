const db = require('../../app/data')

const schema = require('./schema')

const getScheduledSettlements = require('./get-scheduled-settlements')
const updateScheduledSettlementsByScheduleId = require('./update-scheduled-settlements-by-schedule-ids')

const processSettlements = async (started = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledSettlements = await getScheduledSettlements(started, transaction)

    const result = schema.validate(scheduledSettlements[0], {
      abortEarly: false
    })

    if (result.error) {
      throw new Error(`Schedule with scheduleId: ${scheduledSettlements.scheduleId} does not have the required data: ${result.error.message}`)
    }

    await updateScheduledSettlementsByScheduleId(scheduledSettlements.map(x => x.scheduleId), started, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processSettlements
