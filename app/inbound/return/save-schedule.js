const db = require('../../data')
const saveSchedule = async (settlement, transaction) => {
  if (settlement) {
    await db.schedule.create({ settlementId: settlement.settlementId }, { transaction })
  } else {
    throw new Error('Schedule can not be saved for null settlement')
  }
}

module.exports = saveSchedule
