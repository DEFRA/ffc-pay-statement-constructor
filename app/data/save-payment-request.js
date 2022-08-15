const db = require('.')

const savePaymentRequest = async (paymentRequest, transaction) => {
  delete paymentRequest.paymentRequestId
  return db.paymentRequest.create({ ...paymentRequest, received: new Date() }, { transaction })
}

module.exports = savePaymentRequest
