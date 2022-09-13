const updateScheduleByScheduleId = require('./update-schedule-by-schedule-id')
const publishStatement = require('./publish-statement')

const sendStatement = async (scheduleId, statement, transaction) => {
  try {
    await publishStatement(statement)
    await updateScheduleByScheduleId(scheduleId, transaction)
  } catch (err) {
    throw new Error(`Failed to send statement with scheduleId of ${scheduleId}`, err)
  }
}

module.exports = sendStatement
