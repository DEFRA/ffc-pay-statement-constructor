const moment = require('moment')
const db = require('../../data')
const config = require('../../config').processingConfig

const getScheduledSettlements = async (started, transaction) => {
  return db.schedule.findAll({
    lock: true,
    skipLocked: true,
    limit: config.scheduleProcessingMaxBatchSize,
    transaction,
    attributes: [
      'scheduleId',
      'settlementId'
    ],
    where: {
      completed: null,
      [db.Sequelize.Op.or]: [{
        started: null
      }, {
        started: { [db.Sequelize.Op.lte]: moment(started).subtract(config.scheduleProcessingMaxElapsedTime).toDate() }
      }]
    },
    raw: true
  })
}

module.exports = getScheduledSettlements
