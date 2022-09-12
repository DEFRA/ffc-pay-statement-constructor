const updateScheduleByScheduleId = require('./update-schedule-by-schedule-id')

const sendStatement = async (scheduleId, statement, transaction) => {
  await updateScheduleByScheduleId(scheduleId, transaction)
  return [scheduleId, statement]
}

module.exports = sendStatement
