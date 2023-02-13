const db = require('../../../../app/data')
const hasLaterPaymentRequest = require('../../../app/processing/payment-request/has-later-payment-request')

describe('has later payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  
})
