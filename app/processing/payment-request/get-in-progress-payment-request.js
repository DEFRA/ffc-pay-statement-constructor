const db = require('../../data')
const { IN_PROGRESS } = require('../../constants/statuses')

const getInProgressPaymentRequestByReferenceId = async (agreementNumber, marketingYear, paymentRequestNumber, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    attributes: [
      'paymentRequestId',
      'agreementNumber',
      'dueDate',
      'invoiceNumber',
      'marketingYear',
      'paymentRequestNumber',
      'schedule',
      'value'
    ],
    where: {
      agreementNumber,
      paymentRequestNumber,
      marketingYear,
      status: IN_PROGRESS
    },
    raw: true
  })
}

module.exports = getInProgressPaymentRequestByReferenceId
