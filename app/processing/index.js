const { processingConfig } = require('../config')
const db = require('../data')

const schedulePendingSettlements = require('./schedule')
const { getStatement, sendStatement } = require('./statement')

const start = async () => {
  try {
    const transaction = await db.sequelize.transaction()

    const pendingStatements = await schedulePendingSettlements()
    if (!pendingStatements) {
      throw new Error('No statements to be generated')
    }

    for (const pendingStatement of pendingStatements) {
      const aggregatedStatement = await getStatement(pendingStatement.settlementId, transaction)
      await sendStatement(pendingStatement.scheduleId, aggregatedStatement)
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.settlementProcessingInterval)
  }
}

module.exports = { start }
