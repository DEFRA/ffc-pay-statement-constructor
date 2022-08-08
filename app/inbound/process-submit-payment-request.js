const db = require('../data')

const { COMPLETED } = require('../constants/statuses')

const getPaymentRequestByReferenceId = require('../data/get-payment-request-by-reference-id')
const saveInvoiceNumber = require('../data/save-invoice-number')
const { updateAndReturnPaymentRequest } = require('../data/update-payment-request')
const updateInvoiceLines = require('../data/update-invoice-lines')

const processSubmitPaymentRequest = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    const existingPaymentRequest = await getPaymentRequestByReferenceId(paymentRequest.referenceId, transaction)
    if (existingPaymentRequest) {
      console.info(`Duplicate payment request received, skipping ${existingPaymentRequest.referenceId}`)
      await transaction.rollback()
    } else {
      await saveInvoiceNumber(paymentRequest.invoiceNumber, transaction)
      const updatedPaymentRequest = await updateAndReturnPaymentRequest(paymentRequest.paymentRequestId, { ...paymentRequest, status: COMPLETED }, transaction)
      await updateInvoiceLines(paymentRequest.invoiceLines, updatedPaymentRequest.paymentRequestId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processSubmitPaymentRequest
