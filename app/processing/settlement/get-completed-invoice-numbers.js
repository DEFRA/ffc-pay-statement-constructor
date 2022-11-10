const db = require('../../data')
const { COMPLETED } = require('../../constants/statuses')

const getSupportingInvoiceNumbers = async (agreementNumber, marketingYear, transaction) => {
  const completedPaymentRequests = await db.paymentRequest.findAll({
    transaction,
    attributes: ['invoiceNumber'],
    where: {
      paymentRequestNumber: {
        [db.Sequelize.Op.gt]: 1
      },
      agreementNumber,
      marketingYear,
      status: COMPLETED
    },
    raw: true
  })
  return completedPaymentRequests.map(paymentRequest => paymentRequest.invoiceNumber)
}

module.exports = getSupportingInvoiceNumbers
