const { processingConfig } = require('../config')
const waitForIdleMessaging = require('../messaging/wait-for-idle-messaging')
const schedulePendingSettlements = require('./schedule')
const { getStatement, sendStatement } = require('./statement')

const start = async () => {
  try {
    if (processingConfig.constructionActive) {
      await waitForIdleMessaging()
      const pendingStatements = await schedulePendingSettlements()

      for (const pendingStatement of pendingStatements) {
        try {
          const aggregatedStatement = await getStatement(pendingStatement.settlementId)
          await sendStatement(pendingStatement.scheduleId, aggregatedStatement)
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
