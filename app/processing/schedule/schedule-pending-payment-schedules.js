const db = require('../../data')

const getScheduledPaymentSchedules = require('./get-scheduled-payment-schedules')
const getValidScheduled = require('./get-valid-scheduled')
const getUpdatedSchedule = require('./get-updated-scheduled')

const schedulePendingPaymentSchedules = async () => {
  const started = new Date()
  const transaction = await db.sequelize.transaction()
  try {
    const scheduledPaymentSchedules = await getScheduledPaymentSchedules(started, transaction)
    const validScheduledPaymentSchedules = getValidScheduled(scheduledPaymentSchedules)
    const updatedScheduledPaymentSchedules = await getUpdatedSchedule(validScheduledPaymentSchedules, started, transaction)
    await transaction.commit()
    return updatedScheduledPaymentSchedules
  } catch (err) {
    await transaction.rollback()
    console.error('Could not schedule payment schedules', err)
    return []
  }
}

module.exports = schedulePendingPaymentSchedules
