const validateSchedule = require('./validate-schedule')

const getValidScheduledSettlements = (scheduledSettlements) => {
  const validScheduledSettlements = []
  for (const scheduledSettlement of scheduledSettlements) {
    try {
      validScheduledSettlements.push(validateSchedule(scheduledSettlement))
    } catch (err) {
      console.error(err)
    }
  }
  return validScheduledSettlements
}

module.exports = getValidScheduledSettlements
