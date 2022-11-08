const db = require('../../data')
const { IN_PROGRESS } = require('../../constants/statuses')

const getInProgressPaymentRequestByReferenceId = async (referenceId, transaction) => {
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
      referenceId,
      status: IN_PROGRESS
    },
    raw: true
  })
}

module.exports = getInProgressPaymentRequestByReferenceId
