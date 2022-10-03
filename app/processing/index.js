const { processingConfig } = require('../config')

const schedulePendingSettlements = require('./schedule')
const { getStatement, sendStatement } = require('./statement')

const start = async () => {
  try {
    if (processingConfig.constructionActive) {
      const pendingStatements = await schedulePendingSettlements()
      if (!pendingStatements) {
        throw new Error('No statements to be generated')
      }

      for (const pendingStatement of pendingStatements) {
        const aggregatedStatement = await getStatement(pendingStatement.settlementId)
        await sendStatement(pendingStatement.scheduleId, aggregatedStatement)
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.settlementProcessingInterval)
  }
}

module.exports = { start }
