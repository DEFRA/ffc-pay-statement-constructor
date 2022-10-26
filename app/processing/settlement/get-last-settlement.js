const db = require('../../data')

const getLastSettlement = async (settlementDate, value, invoiceNumber, transaction) => {
  return db.settlement.findOne({
    transaction,
    attributes: [
      'value'
    ],
    where: {
      settlementDate: {
        [db.Sequelize.Op.lt]: settlementDate
      },
      value: {
        [db.Sequelize.Op.lt]: value
      },
      invoiceNumber,
      settled: true
    },
    order: [
      ['settlementDate', 'DESC']
    ],
    raw: true
  })
}

module.exports = getLastSettlement
