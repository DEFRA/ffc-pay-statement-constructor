const db = require('.')
const { IN_PROGRESS } = require('../constants/statuses')

const getInProgressPaymentRequestByReferenceId = async (referenceId, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    where: {
      referenceId,
      status: IN_PROGRESS
    }
  })
}

module.exports = getInProgressPaymentRequestByReferenceId
