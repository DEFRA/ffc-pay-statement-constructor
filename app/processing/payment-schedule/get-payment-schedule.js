const db = require('../../data')
const { getInProgressPaymentRequest, getPreviousPaymentRequests, getCompletedPaymentRequestByPaymentRequestId } = require('../payment-request')
const getCalculation = require('../calculation')
const { getDetails, getAddress, getScheme } = require('../components')
const { calculatePaymentSchedule } = require('../payment')
const { getScheduleSupportingSettlements } = require('../settlement')

const getPaymentSchedule = async (paymentRequestId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const completedPaymentRequest = await getCompletedPaymentRequestByPaymentRequestId(paymentRequestId, transaction)
    const paymentRequest = await getInProgressPaymentRequest(completedPaymentRequest.correlationId, transaction)
    const previousPaymentRequests = await getPreviousPaymentRequests(paymentRequest.agreementNumber, paymentRequest.marketingYear, paymentRequest.paymentRequestNumber, transaction)
    const lastPaymentRequest = previousPaymentRequests[0]
    const supportingSettlements = await getScheduleSupportingSettlements(previousPaymentRequests, transaction)
    const previousPaymentSchedule = calculatePaymentSchedule(lastPaymentRequest, supportingSettlements, lastPaymentRequest.value)
    const newPaymentSchedule = calculatePaymentSchedule(paymentRequest)
    const schedule = getSchedule(previousPaymentSchedule, newPaymentSchedule, completedPaymentRequest.value)
    const adjustment = getAdjustment(lastPaymentRequest.value, paymentRequest.value, completedPaymentRequest.value)
    const calculation = await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber, transaction)
    const details = await getDetails(calculation.sbi, transaction)
    const address = await getAddress(calculation.sbi, transaction)
    const scheme = getScheme(paymentRequest.year, paymentRequest.frequency, paymentRequest.agreementNumber)

    await transaction.commit()
    return {
      ...details,
      address,
      scheme,
      adjustment,
      schedule
    }
  } catch (err) {
    await transaction.rollback()
    throw new Error(`Payment request with paymentRequestId: ${paymentRequestId} does not have the required data: ${err.message}`)
  }
}

const { convertToPounds } = require('../../utility')

const getSchedule = (previousPaymentSchedule, newPaymentSchedule, deltaValue) => {
  if (previousPaymentSchedule.every(x => x.outstanding)) {
    return mapSchedule(newPaymentSchedule)
  }

  const paidSegments = previousPaymentSchedule.filter(x => !x.outstanding)
  paidSegments.push({
    period: 'Adjustment',
    value: Math.trunc((deltaValue / previousPaymentSchedule.length) * paidSegments.length)
  })
  newPaymentSchedule.splice(0, paidSegments.length - 1)
  const schedule = paidSegments.concat(newPaymentSchedule)

  return mapSchedule(schedule)
}

const mapSchedule = (schedule) => {
  return schedule.map((segment, i) => ({
    order: i + 1,
    dueDate: segment.dueDate?.format('DD/MM/YYYY'),
    period: segment.period,
    value: convertToPounds(segment.value)
  }))
}

const getAdjustment = (previousValue, newValue, adjustmentValue) => {
  return {
    currentValue: convertToPounds(previousValue),
    newValue: convertToPounds(newValue),
    adjustmentValue: convertToPounds(adjustmentValue)
  }
}

module.exports = getPaymentSchedule
