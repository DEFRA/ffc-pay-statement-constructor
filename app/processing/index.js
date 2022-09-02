const { processingConfig } = require('../config')
const batchSchedule = require('./schedule')

const start = async () => {
  try {
    await batchSchedule()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.settlementProcessingInterval)
  }
}

module.exports = { start }
