const db = require('../data')

const { IN_PROGRESS } = require('../constants/statuses')

const getInProgressPaymentRequestByInvoiceNumber = require('../data/get-in-progress-payment-request-by-invoice-number')
const saveInvoiceNumber = require('../data/save-invoice-number')
const savePaymentRequest = require('../data/save-payment-request')
const saveInvoiceLines = require('../data/save-invoice-lines')

const processProcessingPaymentRequest = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingPaymentRequest = await getInProgressPaymentRequestByInvoiceNumber(paymentRequest.invoiceNumber, transaction)
    if (existingPaymentRequest) {
      console.info(`Duplicate processing payment request received, skipping ${existingPaymentRequest.invoiceNumber}`)
      await transaction.rollback()
    } else {
      await saveInvoiceNumber(paymentRequest.invoiceNumber, transaction)
      const savedPaymentRequest = await savePaymentRequest({ ...paymentRequest, status: IN_PROGRESS }, transaction)
      await saveInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processProcessingPaymentRequest
