const getPeriodFromSchedule = (totalValue, totalPayments, paymentValue, schedule, increment, unit) => {
  const incrementValue = Math.trunc(totalValue / totalPayments)
  const incrementsInPayment = Math.trunc((paymentValue / incrementValue) - 1)
  const firstPeriodIndex = schedule.findIndex(x => x.outstanding)
  const firstPayment = schedule[firstPeriodIndex]
  const lastPayment = schedule[firstPeriodIndex + incrementsInPayment]
  return `${firstPayment.dueDate.format('MMMM')} to ${lastPayment.dueDate.add(increment - 1, unit).format('MMMM YYYY')}`
}

module.exports = getPeriodFromSchedule
