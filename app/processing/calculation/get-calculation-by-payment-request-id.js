const db = require('../../data')

const getCalculationByPaymentRequestId = async (paymentRequestId) => {
  return db.calculation.findOne({
    attributes: [
      'calculationId',
      'calculationDate',
      'invoiceNumber',
      'sbi'
    ],
    where: {
      paymentRequestId
    },
    raw: true
  })
}

module.exports = getCalculationByPaymentRequestId
