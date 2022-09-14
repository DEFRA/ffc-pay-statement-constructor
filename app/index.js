require('./insights').setup()
require('log-timestamp')

const mockSettlement = JSON.parse(JSON.stringify(require('../test/mock-settlement')))
const mockSchedule = JSON.parse(JSON.stringify(require('../test/mock-schedule')))
const statement = JSON.parse(JSON.stringify(require('../test/mock-objects/mock-statement')))
const db = require('../app/data')

const { initialiseContainers } = require('./storage')

const messaging = require('./messaging')
const processing = require('./processing')
const sendStatement = require('./processing/statement')

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
  // await messaging.start()
  // await processing.start()

  await db.settlement.create(mockSettlement)
  await db.schedule.create(mockSchedule)
  const transaction = await db.sequelize.transaction()
  await sendStatement(1, statement, transaction)
  transaction.commit()
})()
