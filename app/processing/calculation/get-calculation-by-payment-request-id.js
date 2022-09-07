const db = require('../../data')

const getCalculationByPaymentRequestId = async (paymentRequestId) => {
  return db.calculation.findOne({
    attributes: [
      'sbi',
      'calculationDate'
    ],
    where: {
      paymentRequestId
    },
    raw: true
  })
}

module.exports = getCalculationByPaymentRequestId
