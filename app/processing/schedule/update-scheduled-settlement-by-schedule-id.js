const db = require('../../data')

const updateScheduledSettlementByScheduleId = async (scheduleId, started, transaction) => {
  await db.schedule.update({ started }, {
    transaction,
    where: {
      scheduleId
    }
  })
}

module.exports = updateScheduledSettlementByScheduleId
