const { processingConfig } = require('../config')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const schedulePendingSettlements = require('./schedule')
const { getStatement, sendStatement, validateStatement } = require('./statement')
const updateScheduleByScheduleId = require('./statement/update-schedule-by-schedule-id')

const start = async () => {
  try {
    if (processingConfig.constructionActive) {
      await waitForIdleMessaging()
      const pendingStatements = await schedulePendingSettlements()

      for (const pendingStatement of pendingStatements) {
        try {
          const aggregatedStatement = await getStatement(pendingStatement.settlementId)
          if (validateStatement(aggregatedStatement)) {
            await sendStatement(aggregatedStatement)
          }
          await updateScheduleByScheduleId(pendingStatement.scheduleId)
        } catch (err) {
          console.error(err.message)
        }
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.settlementProcessingInterval)
  }
}

module.exports = { start }
