const db = require('../data')

const savePaymentRequest = async (paymentRequest, transaction) => {
  delete paymentRequest.paymentRequestId
  await db.paymentRequest.create({ ...paymentRequest, received: new Date() }, { transaction })
}

const saveAndReturnPaymentRequest = async (paymentRequest, transaction) => {
  return savePaymentRequest(paymentRequest, transaction)
}

module.exports = { saveAndReturnPaymentRequest, savePaymentRequest }
