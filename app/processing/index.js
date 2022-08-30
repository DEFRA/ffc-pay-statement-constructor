const { processingConfig } = require('../config')
const processSettlements = require('./process-settlements')

const start = async () => {
  try {
    await processSettlements()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.settlementProcessingInterval)
  }
}

module.exports = { start }
