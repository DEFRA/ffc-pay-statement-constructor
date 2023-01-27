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

module.exports = getSchedule
