const db = require('../../data')
const { getInProgressPaymentRequestFromCompleted } = require('../payment-request')
const getCalculation = require('../calculation')
const { getDetails, getAddress, getScheme } = require('../components')

const getPaymentSchedule = async (paymentRequestId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequest = await getInProgressPaymentRequestFromCompleted(paymentRequestId, transaction)
    const calculation = await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber, transaction)
    const sbi = calculation.sbi
    const details = await getDetails(sbi, transaction)
    const address = await getAddress(sbi, transaction)
    const scheme = getScheme(paymentRequest.year, paymentRequest.frequency, paymentRequest.agreementNumber)

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
