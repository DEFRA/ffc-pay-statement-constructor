const moment = require('moment')
const { DAX_CODES } = require('../../constants/schedules')

const calculatePaymentSchedule = (paymentRequest) => {
  const scheduleDate = moment(paymentRequest.dueDate, 'DD/MM/YYYY')

  switch (paymentRequest.schedule) {
    case DAX_CODES.QUARTERLY:
      return getSchedule(scheduleDate, 4, paymentRequest.value, 3, 'month')
    case DAX_CODES.MONTHLY:
      return getSchedule(scheduleDate, 12, paymentRequest.value, 1, 'month')
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule(scheduleDate, 4, paymentRequest.value, 3, 'day')
    default:
      throw new Error(`Unknown schedule ${paymentRequest.schedule}`)
  }
}

const getSchedule = (scheduleDate, totalPayments, totalValue, increment, unit) => {
  const scheduleDates = []
  for (let i = 1; i <= totalPayments; i++) {
    scheduleDates.push({
      dueDate: scheduleDate.clone(),
      period: getPeriod(scheduleDate, totalPayments, i, increment, unit),
      value: getExpectedValue(totalValue, totalPayments, i === totalPayments)
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
