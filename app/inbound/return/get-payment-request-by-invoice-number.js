const db = require('../../data')

const getPaymentRequestbyInvoiceNumber = async (invoiceNumber, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber
    }
  })
}

module.exports = getPaymentRequestbyInvoiceNumber
