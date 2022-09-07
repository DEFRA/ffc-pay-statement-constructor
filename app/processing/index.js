const { processingConfig } = require('../config')
const schedulePendingSettlements = require('./schedule')

const start = async () => {
  try {
    await schedulePendingSettlements()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.settlementProcessingInterval)
  }
}

module.exports = { start }
