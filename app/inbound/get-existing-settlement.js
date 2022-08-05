const db = require('../data')

const getExistingSettlement = async (invoiceNumber, transaction) => {
  return db.settlement.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber
    }
  })
}

module.exports = getExistingSettlement
