const db = require('../../data')
const { COMPLETED } = require('../../constants/statuses')

const getLatestCompletedPaymentRequest = async (agreementNumber, marketingYear, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    attributes: [
      'agreementNumber',
      'correlationId',
      'marketingYear',
      'paymentRequestNumber'
    ],
    where: {
      agreementNumber,
      marketingYear,
      status: COMPLETED
    },
    order: [['paymentRequestNumber', 'DESC']],
    limit: 1,
    raw: true
  })
}

module.exports = getLatestCompletedPaymentRequest
