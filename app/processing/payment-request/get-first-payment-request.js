const { IN_PROGRESS } = require('../../constants/statuses')
const db = require('../../data')

const getFirstPaymentRequest = async (agreementNumber, schemeYear, transaction) => {
  return db.PaymentRequest.findOne({
    where: {
      paymentRequestNumber: 1,
      agreementNumber,
      schemeYear,
      status: IN_PROGRESS
    }
  }, { transaction })
}

module.exports = getFirstPaymentRequest
