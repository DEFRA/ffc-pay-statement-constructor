const db = require('../../../app/data')

const updateScheduleByScheduleId = async (scheduleId, transaction) => {
  await db.schedule.update({ completed: new Date() }, {
    transaction,
    lock: true,
    where: {
      scheduleId
    }
  })
}

module.exports = updateScheduleByScheduleId
