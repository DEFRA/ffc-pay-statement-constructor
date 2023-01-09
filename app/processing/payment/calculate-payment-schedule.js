const moment = require('moment')
const { DAX_CODES } = require('../../constants/schedules')

const calculatePaymentSchedule = (paymentRequest, previousSettlements = [], previousValue = 0, currentDate = new Date()) => {
  const settledValue = getSettledValue(previousSettlements)
  const totalValue = previousValue === 0 ? paymentRequest.value : previousValue

  const scheduleDate = moment(paymentRequest.dueDate, 'DD/MM/YYYY')

  switch (paymentRequest.schedule) {
    case DAX_CODES.QUARTERLY:
      return getSchedule(scheduleDate, 4, settledValue, totalValue, 3, 'month', currentDate)
    case DAX_CODES.MONTHLY:
      return getSchedule(scheduleDate, 12, settledValue, totalValue, 1, 'month', currentDate)
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule(scheduleDate, 4, settledValue, totalValue, 3, 'day', currentDate)
    default:
      throw new Error(`Unknown schedule ${paymentRequest.schedule}`)
  }
}

const getSettledValue = (previousSettlements) => {
  return previousSettlements.reduce((total, settlement) => total + settlement.value, 0)
}

const getSchedule = (scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate) => {
  const scheduleDates = []
  let expectedSettlementValue = 0
  for (let i = 1; i <= totalPayments; i++) {
    expectedSettlementValue = getExpectedValue(totalValue, totalPayments, i === totalPayments)
    const cappedSettlementValue = settledValue <= expectedSettlementValue ? settledValue : expectedSettlementValue
    scheduleDates.push({
      dueDate: scheduleDate.clone(),
      period: getPeriod(scheduleDate, totalPayments, i, increment, unit),
      value: expectedSettlementValue,
      outstanding: scheduleDate >= currentDate || cappedSettlementValue < expectedSettlementValue
    })
    scheduleDate = scheduleDate.add(increment, unit)
  }

  return scheduleDates
}

const getExpectedValue = (totalValue, totalPayments, lastSegment = false) => {
  // DAX rounds up each segment value to the nearest whole pound and addresses any variance in final quarter
  // need to replicate that here so that the payment schedule reflects the actual payment value
  const segmentValue = Math.ceil(totalValue / totalPayments)
  return !lastSegment ? segmentValue : Math.trunc(totalValue - (segmentValue * (totalPayments - 1)))
}

const getPeriod = (scheduleDate, totalPayments, segment, increment, unit) => {
  const firstPeriod = scheduleDate.clone().subtract(increment, unit)
  const lastPeriod = scheduleDate.clone().subtract(1, unit)
  return `${firstPeriod.format('MMMM')} to ${lastPeriod.format('MMMM YYYY')}`
}

module.exports = calculatePaymentSchedule
