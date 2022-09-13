const db = require('../../data')

const getCalculationByPaymentRequestId = async (paymentRequestId) => {
  return db.calculation.findOne({
    attributes: [
      'calculationId',
      'calculationDate',
      'invoiceNumber',
      'paymentRequestId',
      'sbi'
    ],
    where: {
      paymentRequestId
    },
    raw: true
  })
}

module.exports = getCalculationByPaymentRequestId
