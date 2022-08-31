const moment = require('moment')
const db = require('../../app/data')

const STATEMENT_CREATION_ELASPED_MAX_TIME = 300000

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
        started: { [db.Sequelize.Op.lte]: moment(started).subtract(STATEMENT_CREATION_ELASPED_MAX_TIME).toDate() }
      }]
    },
    raw: true
  })
}

module.exports = getScheduledSettlements
