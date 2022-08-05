const db = require('../data')

const { IN_PROGRESS } = require('../constants/statuses')

const getPaymentRequestByReferenceId = require('./get-payment-request-by-reference-id')
const saveInvoiceNumber = require('./save-invoice-number')
const { saveAndReturnPaymentRequest } = require('./save-payment-request')
const saveInvoiceLines = require('./save-invoice-lines')

const processProcessingPaymentRequest = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    const existingPaymentRequest = await getPaymentRequestByReferenceId(paymentRequest.referenceId, transaction)
    if (existingPaymentRequest) {
      console.info(`Duplicate payment request received, skipping ${existingPaymentRequest.referenceId}`)
      await transaction.rollback()
    } else {
      await saveInvoiceNumber(paymentRequest.invoiceNumber, transaction)
      const savedPaymentRequest = await saveAndReturnPaymentRequest({ ...paymentRequest, status: IN_PROGRESS }, transaction)
      await saveInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processProcessingPaymentRequest
