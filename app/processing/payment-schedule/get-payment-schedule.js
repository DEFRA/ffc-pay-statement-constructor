const db = require('../../data')
const { getInProgressPaymentRequestFromCompleted } = require('../payment-request')
const getCalculation = require('../calculation')
const { getDetails, getAddress, getScheme, getSchedule } = require('../components')

const getPaymentSchedule = async (paymentRequestId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequest = await getInProgressPaymentRequestFromCompleted(paymentRequestId, transaction)
    const calculation = await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber, transaction)
    const details = await getDetails(calculation.sbi, transaction)
    const address = await getAddress(calculation.sbi, transaction)
    const scheme = getScheme(paymentRequest.year, paymentRequest.frequency, paymentRequest.agreementNumber)
    const schedule = getSchedule(paymentRequest.payments)

    await transaction.commit()
    return {
      ...details,
      address,
      scheme,
      schedule
    }
  } catch (err) {
    await transaction.rollback()
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required data: ${err.message}`)
  }
}

module.exports = getPaymentSchedule
