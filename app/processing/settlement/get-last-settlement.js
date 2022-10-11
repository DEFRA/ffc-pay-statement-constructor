const db = require('../../data')

const getLastSettlement = async (invoiceNumber, settlementDate, transaction) => {
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
        [db.Sequelize.Op.lt]: settlementDate
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
