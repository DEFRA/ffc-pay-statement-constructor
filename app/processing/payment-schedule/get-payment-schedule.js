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
    const mappedPaymentRequest = mapPaymentRequest(paymentRequest)
    const previousPaymentRequests = await getPreviousPaymentRequests(mappedPaymentRequest.agreementNumber, mappedPaymentRequest.year, mappedPaymentRequest.paymentRequestNumber, transaction)
    const lastPaymentRequest = previousPaymentRequests[0]
    const supportingSettlements = await getScheduleSupportingSettlements(previousPaymentRequests, transaction)
    const previousPaymentSchedule = calculatePaymentSchedule(lastPaymentRequest, supportingSettlements, lastPaymentRequest.value)
    const newPaymentSchedule = calculatePaymentSchedule(paymentRequest)
    const schedule = getSchedule(previousPaymentSchedule, newPaymentSchedule, completedPaymentRequest.value)
    const adjustment = getAdjustment(lastPaymentRequest.value, mappedPaymentRequest.value, completedPaymentRequest.value)
    const calculation = await getCalculation(mappedPaymentRequest.paymentRequestId, mappedPaymentRequest.invoiceNumber, transaction)
    const details = await getDetails(calculation.sbi, transaction)
    const address = await getAddress(calculation.sbi, transaction)
    const scheme = getScheme(mappedPaymentRequest.year, mappedPaymentRequest.frequency, mappedPaymentRequest.agreementNumber)

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
const mapPaymentRequest = require('../payment-request/map-payment-request')

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
