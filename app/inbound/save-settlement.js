const db = require('../data')

const saveSettlement = async (settlement, transaction) => {
  settlement.paymentRequestId = 1
  await db.settlement.create({ ...settlement }, { transaction })
}

module.exports = saveSettlement
