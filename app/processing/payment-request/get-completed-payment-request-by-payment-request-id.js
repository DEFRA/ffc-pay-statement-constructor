const db = require('../../data')
const { COMPLETED } = require('../../constants/statuses')

const getCompletedPaymentRequestByPaymentRequestId = async (paymentRequestId, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    attributes: [
      'paymentRequestId',
      'referenceId',
      'agreementNumber',
      'dueDate',
      'invoiceNumber',
      'marketingYear',
      'schedule',
      'value'
    ],
    where: {
      paymentRequestId,
      status: COMPLETED
    },
    raw: true
  })
}

module.exports = getCompletedPaymentRequestByPaymentRequestId
