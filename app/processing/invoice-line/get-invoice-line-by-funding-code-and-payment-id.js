const db = require('../../data')

const getInvoiceLineByFundingCodeAndPaymentId = async (fundingCode, paymentRequestId) => {
  return db.invoiceLine.findOne({
    attributes: [
      'value'
    ],
    where: {
      paymentRequestId,
      fundingCode,
      value: { [db.Sequelize.Op.gte]: 0 }
    },
    raw: true
  })
}

module.exports = getInvoiceLineByFundingCodeAndPaymentId
