const db = require('../../data')

const getInvoiceLineByPaymentRequestId = async (paymentRequestId, transaction) => {
  return db.invoiceLine.findOne({
    transaction,
    lock: true,
    attributes: [
      'accountCode',
      'description',
      'fundCode',
      'value'
    ],
    where: {
      paymentRequestId
    },
    raw: true
  })
}

module.exports = getInvoiceLineByPaymentRequestId
