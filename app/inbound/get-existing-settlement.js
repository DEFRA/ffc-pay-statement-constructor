const db = require('../data')

const getExistingSettlement = async (settlement, transaction) => {
  return db.settlement.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber: settlement.invoiceNumber,
      value: settlement.value
    }
  })
}

module.exports = getExistingSettlement
