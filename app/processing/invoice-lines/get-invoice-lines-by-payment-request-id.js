const db = require('../../data')

// this will return an array
// possible multiple invoiceLines per paymentRequest
// some gross payment and some reductions
const getInvoiceLinesByPaymentRequestId = async (paymentRequestId, transaction) => {
  return db.invoiceLine.findAll({
    transaction,
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

module.exports = getInvoiceLinesByPaymentRequestId
