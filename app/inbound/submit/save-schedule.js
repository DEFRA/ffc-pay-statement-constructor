const { SCHEDULE } = require('../../constants/categories')
const db = require('../../data')
const isFirstPayment = require('./is-first-payment')

const saveSchedule = async (paymentRequest, transaction) => {
  if (paymentRequest) {
    if (!isFirstPayment(paymentRequest.paymentRequestNumber)) {
      await db.schedule.create({ paymentRequestId: paymentRequest.paymentRequestId, category: SCHEDULE }, { transaction })
    }
  } else {
    throw new Error('Payment request can not be saved for null settlement')
  }
}

module.exports = saveSchedule
