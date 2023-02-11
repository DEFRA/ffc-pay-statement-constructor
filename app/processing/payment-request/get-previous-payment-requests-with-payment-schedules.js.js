const { COMPLETED } = require('../../constants/statuses')
const db = require('../../data')

const getPreviousPaymentRequestsWithPaymentSchedules = async (previousPaymentRequests, transaction) => {
  const previousPaymentRequestsWithSchedules = []

  for (const paymentRequest of previousPaymentRequests) {
    // Always allow first payment request so we always have a payment request to compare against
    if (paymentRequest.paymentRequestNumber === 1) {
      previousPaymentRequestsWithSchedules.push(paymentRequest)
    } else {
      const completedPaymentRequest = await db.paymentRequest.findOne({
        transaction,
        where: {
          correlationId: paymentRequest.correlationId,
          status: COMPLETED
        }
      })
      if (completedPaymentRequest) {
        const completedSchedule = await db.schedule.findOne({
          transaction,
          where: {
            paymentRequestId: completedPaymentRequest.paymentRequestId,
            completed: {
              [db.Sequelize.Op.ne]: null
            },
            voided: null
          }
        })
        if (completedSchedule) {
          previousPaymentRequestsWithSchedules.push(paymentRequest)
        }
      }
    }
  }
  return previousPaymentRequestsWithSchedules
}

module.exports = getPreviousPaymentRequestsWithPaymentSchedules
