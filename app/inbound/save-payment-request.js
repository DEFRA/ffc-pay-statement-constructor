const { v4: uuidv4 } = require('uuid')
const db = require('../data')

const savePaymentRequest = async (paymentRequest, transaction) => {
  delete paymentRequest.paymentRequestId
  await db.paymentRequest.create({ ...paymentRequest, referenceId: uuidv4() }, { transaction })
}

module.exports = savePaymentRequest
