const db = require('../../data')
const { IN_PROGRESS } = require('../../constants/statuses')

const getInProgressPaymentRequestByReferenceId = async (correlationId, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    attributes: [
      'paymentRequestId',
      'agreementNumber',
      'correlationId',
      'dueDate',
      'invoiceNumber',
      'marketingYear',
      'paymentRequestNumber',
      'schedule',
      'value'
    ],
    where: {
      correlationId,
      status: IN_PROGRESS
    },
    raw: true
  })
}

module.exports = getInProgressPaymentRequestByReferenceId
