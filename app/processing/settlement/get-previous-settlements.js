const db = require('../../data')
const getInvoicePrefix = require('./get-invoice-prefix')

const getPreviousSettlements = async (invoiceNumber, settlementDate, transaction) => {
  const invoicePrefix = getInvoicePrefix(invoiceNumber)
  return db.settlement.findAll({
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
      invoiceNumber: {
        [db.Sequelize.Op.like]: `${invoicePrefix}%`
      }
    },
    raw: true
  })
}

module.exports = getPreviousSettlements
