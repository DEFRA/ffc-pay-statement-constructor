const db = require('.')

const updatePaymentRequest = async (paymentRequestId, paymentRequest, transaction) => {
  await db.paymentRequest.update({
    ...paymentRequest,
    received: new Date()
  },
  { where: { paymentRequestId } },
  { transaction })
}

const updateAndReturnPaymentRequest = async (paymentRequestId, paymentRequest, transaction) => {
  return updatePaymentRequest(paymentRequestId, paymentRequest, transaction)
}

module.exports = { updateAndReturnPaymentRequest, updatePaymentRequest }
