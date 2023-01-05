const db = require('../../data')
const { getInProgressPaymentRequestFromCompleted, getFirstPaymentRequest, getCompletedPaymentRequestByPaymentRequestId } = require('../payment-request')
const getCalculation = require('../calculation')
const { getDetails, getAddress, getScheme } = require('../components')
const calculatePaymentSchedule = require('../payment/calculate-payment-schedule')

const getPaymentSchedule = async (paymentRequestId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequest = await getInProgressPaymentRequestFromCompleted(paymentRequestId, transaction)
    const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId, transaction)
    const firstPaymentRequest = await getFirstPaymentRequest(paymentRequest.agreementNumber, paymentRequest.year, transaction)
    const originalSchedule = calculatePaymentSchedule(firstPaymentRequest)
    const newSchedule = calculatePaymentSchedule(paymentRequest)
    const calculation = await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber, transaction)
    const details = await getDetails(calculation.sbi, transaction)
    const address = await getAddress(calculation.sbi, transaction)
    const scheme = getScheme(paymentRequest.year, paymentRequest.frequency, paymentRequest.agreementNumber)
    const schedule = getSchedule(newSchedule)

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

const { convertToPounds } = require('../../utility')

const getSchedule = (schedule) => {
  return schedule.map(segment => ({
    dueDate: segment.dueDate,
    period: segment.period,
    value: convertToPounds(segment.value)
  }))
}

module.exports = getPaymentSchedule
