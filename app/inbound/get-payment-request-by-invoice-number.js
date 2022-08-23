const db = require('../data')

const getPayementRequestbyInvoiceNumber = async (settlement) => {
  return db.paymentRequest.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
}

module.exports = getPayementRequestbyInvoiceNumber
