const db = require('../../data')

const { COMPLETED } = require('../../constants/statuses')

const getCompletedPaymentRequestByReversedInvoiceNumber = async (reversedInvoiceNumber, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    where: {
      reversedInvoiceNumber,
      status: COMPLETED
    }
  })
}

module.exports = getCompletedPaymentRequestByReversedInvoiceNumber
