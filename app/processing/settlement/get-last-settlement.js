const db = require('../../data')

const getLastSettlement = async (invoiceNumber, settlement, transaction) => {
  return db.settlement.findOne({
    transaction,
    attributes: [
      'paymentRequestId',
      'invoiceNumber',
      'reference',
      'settled',
      'settlementDate',
      'value'
    ],
    where: {
      settlementDate: {
        [db.Sequelize.Op.lt]: settlement.settlementDate
      },
      value: {
        [db.Sequelize.Op.lt]: settlement.value
      },
      invoiceNumber
    },
    order: [
      ['settlementDate', 'DESC']
    ],
    raw: true
  })
}

module.exports = getLastSettlement
