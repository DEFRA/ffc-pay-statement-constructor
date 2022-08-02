const db = require('../data')

const getPaymentRequestByInvoiceNumber = require('./get-payment-request-by-invoice-number')
const saveInvoiceNumber = require('./save-invoice-number')
const savePaymentRequest = require('./save-payment-request')
const saveInvoiceLines = require('./save-invoice-lines')

const processPaymentRequest = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    const existingPaymentRequest = await getPaymentRequestByInvoiceNumber(paymentRequest.invoiceNumber, transaction)
    if (existingPaymentRequest) {
      console.info(`Duplicate payment request received, skipping ${existingPaymentRequest.invoiceNumber}`)
      await transaction.rollback()
    } else {
      await saveInvoiceNumber(paymentRequest.invoiceNumber, transaction)
      await savePaymentRequest(paymentRequest, transaction)
      const savedPaymentRequest = await getPaymentRequestByInvoiceNumber(paymentRequest.invoiceNumber, transaction)
      await saveInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processPaymentRequest
