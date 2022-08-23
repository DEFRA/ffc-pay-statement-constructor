const db = require('../data')

const saveSettlement = async (settlement, transaction) => {
  // find paymentrequestId via invoicenumber and set it in the settlement object
  await db.settlement.create(settlement, { transaction })
}

module.exports = saveSettlement
