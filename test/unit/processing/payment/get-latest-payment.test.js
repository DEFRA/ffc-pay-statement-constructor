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

  test('returns due date from payment request', () => {
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.dueDate).toBe(paymentRequest.dueDate)
  })

  test('returns settled from settlement', () => {
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.settled).toBe(settlement.settlementDate)
  })

  test('returns value from settlement if last settlement undefined', () => {
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.value).toBe(settlement.value)
  })

  test('returns value from settlement if last settlement null', () => {
    lastSettlement = null
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.value).toBe(settlement.value)
  })

  test('returns value from settlement if last settlement value undefined', () => {
    lastSettlement = {}
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.value).toBe(settlement.value)
  })

  test('returns value from settlement if last settlement value null', () => {
    lastSettlement = { value: null }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.value).toBe(settlement.value)
  })

  test('returns value from settlement if last settlement value 0', () => {
    lastSettlement = { value: 0 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.value).toBe(settlement.value)
  })

  test('returns difference between current and last settlement if > 0', () => {
    lastSettlement = { value: 10000 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.value).toBe(40000)
  })

  test('returns period if last settlement undefined', () => {
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('December to February 2023')
  })

  test('returns period if last settlement null', () => {
    lastSettlement = null
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('December to February 2023')
  })

  test('returns period if last settlement undefined', () => {
    lastSettlement = {}
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('December to February 2023')
  })

  test('returns period if last settlement value null', () => {
    lastSettlement = { value: null }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('December to February 2023')
  })

  test('returns period if last settlement value empty', () => {
    lastSettlement = { value: '' }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('December to February 2023')
  })

  test('returns period if last settlement value 0', () => {
    lastSettlement = { value: 0 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('December to February 2023')
  })
})
