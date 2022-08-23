const db = require('../data')

const getPayementRequestbyInvoiceNumber = async (settlement, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber: settlement.invoiceNumber
    }
  })
}

module.exports = getPayementRequestbyInvoiceNumber
