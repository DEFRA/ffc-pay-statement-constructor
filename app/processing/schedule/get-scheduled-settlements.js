const moment = require('moment')
const db = require('../../data')
const config = require('../../config').processingConfig
const { DAX: SOURCE_SYSTEM } = require('../../constants/source-systems')

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
    include: [{
      model: db.settlement,
      as: 'settlements',
      attributes: []
    }],
    where: {
      completed: null,
      '$settlements.sourceSystem$': SOURCE_SYSTEM.SFI,
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
