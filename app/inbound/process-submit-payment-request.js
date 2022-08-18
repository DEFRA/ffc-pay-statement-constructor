const db = require('../data')

const { COMPLETED } = require('../constants/statuses')

const getCompletedPaymentRequestByReferenceId = require('../data/get-completed-payment-request-by-reference-id')
const saveInvoiceNumber = require('../data/save-invoice-number')
const savePaymentRequest = require('../data/save-payment-request')
const saveInvoiceLines = require('../data/save-invoice-lines')

const processSubmitPaymentRequest = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingPaymentRequest = await getCompletedPaymentRequestByReferenceId(paymentRequest.referenceId, transaction)

    if (existingPaymentRequest) {
      console.info(`Duplicate submit payment request received, skipping ${existingPaymentRequest.referenceId}`)
      await transaction.rollback()
    } else {
      await saveInvoiceNumber(paymentRequest.invoiceNumber, transaction)
      const savedPaymentRequest = await savePaymentRequest({ ...paymentRequest, status: COMPLETED }, transaction)
      await saveInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processSubmitPaymentRequest
