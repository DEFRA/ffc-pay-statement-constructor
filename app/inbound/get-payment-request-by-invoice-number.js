const db = require('../data')

const getPaymentRequestByInvoiceNumber = async (invoiceNumber, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber
    }
  })
}

module.exports = getPaymentRequestByInvoiceNumber
