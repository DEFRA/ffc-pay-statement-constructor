const db = require('../data')

const getExistingSettlement = async (settlement, transaction) => {
  return db.settlement.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber: settlement.invoiceNumber,
      [db.Sequelize.Op.and]:
        {
          value: { [db.Sequelize.Op.eq]: settlement.value }
        }
    }
  })
}

module.exports = getExistingSettlement
