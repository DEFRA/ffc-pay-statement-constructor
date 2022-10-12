const moment = require('moment')
const { DAX_CODES } = require('../../constants/schedules')

const getLatestPayment = (paymentRequest, settlement, lastSettlement) => {
  const lastSettlementValue = lastSettlement?.value ?? 0
  const paymentValue = settlement.value - lastSettlementValue
  let period = `${moment(paymentRequest.dueDate).format('MMMM YYYY')}`

  if (paymentRequest.schedule) {
    period = getPaymentSchedule(paymentRequest.schedule, paymentRequest.dueDate, paymentValue, settlement.value, lastSettlementValue, paymentRequest.value, settlement.settlementDate)
  }

  return {
    invoiceNumber: settlement.invoiceNumber,
    reference: settlement.reference,
    dueDate: paymentRequest.dueDate,
    settled: settlement.settlementDate,
    value: paymentValue,
    period
  }
}

const getPaymentSchedule = (schedule, dueDate, paymentValue, settledValue, previousSettledValue, totalValue, currentDate) => {
  const scheduleDate = moment(dueDate, 'DD/MM/YYYY')

  switch (schedule) {
    case DAX_CODES.QUARTERLY:
      return getSchedule(scheduleDate, 4, paymentValue, settledValue, previousSettledValue, totalValue, 3, 'month', currentDate)
    case DAX_CODES.MONTHLY:
      return getSchedule(scheduleDate, 12, paymentValue, settledValue, previousSettledValue, totalValue, 1, 'month', currentDate)
    case DAX_CODES.THREE_DAY_QUARTERLY:
      return getSchedule(scheduleDate, 4, paymentValue, settledValue, previousSettledValue, totalValue, 3, 'day', currentDate)
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }
}

const getSchedule = (scheduleDate, totalPayments, paymentValue, settledValue, previousSettledValue, totalValue, increment, unit, settlementDate) => {
  const scheduleDates = []
  let expectedSettlementValue = 0
  for (let i = 1; i <= totalPayments; i++) {
    expectedSettlementValue = getExpectedValue(totalValue, totalPayments, i)
    const cappedSettlementValue = settledValue <= expectedSettlementValue ? settledValue : expectedSettlementValue
    scheduleDates.push({
      dueDate: scheduleDate.clone(),
      expectedSettlementValue,
      cappedSettlementValue,
      outstanding: cappedSettlementValue > previousSettledValue && cappedSettlementValue <= settledValue
    })
    scheduleDate = scheduleDate.add(increment, unit)
  }

  const incrementValue = Math.trunc(totalValue / totalPayments)
  const incrementsInPayment = Math.trunc((paymentValue / incrementValue) - 1)
  const firstPeriodIndex = scheduleDates.findIndex(x => x.outstanding)
  const firstPayment = scheduleDates[firstPeriodIndex]
  const lastPayment = scheduleDates[firstPeriodIndex + incrementsInPayment]
  return `${firstPayment.dueDate.format('MMMM')} to ${lastPayment.dueDate.add(increment - 1, unit).format('MMMM YYYY')}`
}

const getExpectedValue = (totalValue, totalPayments, segment) => {
  return Math.trunc(totalValue / totalPayments * segment)
}

module.exports = getLatestPayment
