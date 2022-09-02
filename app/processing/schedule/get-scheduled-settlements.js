const moment = require('moment')
const db = require('../../data')
const config = require('../../config').processingConfig

const getScheduledSettlements = async (started, transaction) => {
  return db.schedule.findAll({
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
        started: { [db.Sequelize.Op.lte]: moment(started).subtract(config.scheduleProcessingMaxElaspedTime).toDate() }
      }]
    },
    raw: true
  })
}

module.exports = getScheduledSettlements
