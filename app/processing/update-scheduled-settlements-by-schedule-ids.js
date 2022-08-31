const db = require('../../app/data')

const updateScheduledSettlementsByScheduleId = async (scheduleIds, started, transaction) => {
  for (const scheduleId in scheduleIds) {
    await db.schedule.update({ started }, {
      transaction,
      where: {
        scheduleId
      }
    })
  }
}

module.exports = updateScheduledSettlementsByScheduleId
