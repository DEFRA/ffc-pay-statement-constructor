
const { convertToPounds } = require('../../utility')

const getSchedule = (payments) => {
  return payments.map(payment => ({
    dueDate: payment.dueDate,
    period: payment.period,
    value: convertToPounds(payment.value),
    type: 'scheduled'
  }))
}

module.exports = getSchedule
