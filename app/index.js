require('./insights').setup()
require('log-timestamp')

const { initialiseContainers } = require('./storage')

const messaging = require('./messaging')
const processing = require('./processing')

process.on('SIGTERM', async () => {
  await messaging.stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messaging.stop()
  process.exit(0)
})

module.exports = (async () => {
  initialiseContainers()
  await messaging.start()
  await processing.start()
})()
