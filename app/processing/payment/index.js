const getLatestPayment = require('./get-latest-payment')
const { calculateScheduledPayments } = require('./calculate-scheduled-payments')

module.exports = {
  getLatestPayment,
  calculateScheduledPayments
}
