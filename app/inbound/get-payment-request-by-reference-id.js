const db = require('../data')

const getPaymentRequestByReferenceId = async (referenceId, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    where: {
      referenceId
    }
  })
}

module.exports = getPaymentRequestByReferenceId
