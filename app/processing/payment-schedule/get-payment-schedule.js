const db = require('../../data')
const getCalculation = require('../calculation')
const getInProgressPaymentRequest = require('../payment-request/get-in-progress-payment-request')
const { getDetails, getAddress, getScheme } = require('../statement/components')

const getPaymentSchedule = async (paymentRequestId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequest = await db.paymentRequest.findByPk(paymentRequestId, { transaction })
    const inProgressPaymentRequest = await getInProgressPaymentRequest(paymentRequest.correlationId, transaction)
    const calculation = await getCalculation(inProgressPaymentRequest.paymentRequestId, inProgressPaymentRequest.invoiceNumber, transaction)
    const sbi = calculation.sbi
    const details = await getDetails(sbi, transaction)
    const address = await getAddress(sbi, transaction)
    const scheme = getScheme(inProgressPaymentRequest.year, inProgressPaymentRequest.frequency, inProgressPaymentRequest.agreementNumber)

    await transaction.commit()
    return {
      ...details,
      address,
      scheme
    }
  } catch (err) {
    await transaction.rollback()
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required data: ${err.message}`)
  }
}

module.exports = getPaymentSchedule
