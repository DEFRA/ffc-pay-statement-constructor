const db = require('../../../app/data')

const updateScheduleByScheduleId = async (scheduleId, transaction) => {
  await db.schedule.update(scheduleId, {
    transaction,
    lock: true,
    where: {
      scheduleId
    },
    values: {
      completed: new Date()
    }
  })
}

module.exports = updateScheduleByScheduleId
