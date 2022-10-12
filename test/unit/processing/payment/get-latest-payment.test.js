const getLatestPayment = require('../../../../app/processing/payment/get-latest-payment')
let paymentRequest
let settlement
let lastSettlement

describe('get latest payment', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-payment-request').submitPaymentRequest))
    settlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
  })

  test('returns invoice number from payment request', () => {
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.invoiceNumber).toBe(paymentRequest.invoiceNumber)
  })

  test('returns reference from settlement', () => {
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.reference).toBe(settlement.reference)
  })
})
