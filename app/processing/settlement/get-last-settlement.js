const db = require('../../data')

const getLastSettlement = async (settlement, transaction) => {
  return db.settlement.findOne({
    transaction,
    attributes: [
      'value'
    ],
    where: {
      settlementDate: {
        [db.Sequelize.Op.lt]: settlement.settlementDate
      },
      value: {
        [db.Sequelize.Op.lt]: settlement.value
      },
      invoiceNumber: settlement.invoiceNumber,
      settled: true
    },
    order: [
      ['settlementDate', 'DESC']
    ],
    raw: true
  })
}

module.exports = getLastSettlement
