const db = require('../../data')

const voidScheduledByScheduleId = async (scheduleId, voided, transaction) => {
  await db.schedule.update({ completed: voided }, {
    transaction,
    where: {
      scheduleId
    }
  })
}

module.exports = voidScheduledByScheduleId
