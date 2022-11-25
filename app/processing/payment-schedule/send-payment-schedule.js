const publishPaymentSchedule = require('./publish-payment-schedule')

const sendStatement = async (paymentSchedule) => {
  try {
    await publishPaymentSchedule(paymentSchedule)
  } catch (err) {
    throw new Error('Failed to send payment schedule', err)
  }
}

module.exports = sendStatement
