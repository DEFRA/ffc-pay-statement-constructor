const db = require('../../data')
const { COMPLETED } = require('../../constants/statuses')

const getCompletedPaymentRequestByPaymentRequestId = async (paymentRequestId, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    attributes: [
      'paymentRequestId',
      'dueDate',
      'marketingYear',
      'schedule'
    ],
    where: {
      paymentRequestId,
      status: COMPLETED
    },
    raw: true
  })
}

module.exports = getCompletedPaymentRequestByPaymentRequestId
