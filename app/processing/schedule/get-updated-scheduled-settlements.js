const updateScheduledSettlementByScheduleId = require('./update-scheduled-settlement-by-schedule-id')

const getUpdatedScheduledSettlements = async (validScheduledSettlements, started, transaction) => {
  const updatedScheduledSettlements = []
  for (const validScheduledSettlement of validScheduledSettlements) {
    try {
      await updateScheduledSettlementByScheduleId(validScheduledSettlement.scheduleId, started, transaction)
      updatedScheduledSettlements.push(validScheduledSettlement)
    } catch (err) {
      console.error(`Could not update saved for: ${validScheduledSettlement.scheduleId}, removing from schedule`)
    }
  }
  return updatedScheduledSettlements
}

module.exports = getUpdatedScheduledSettlements
