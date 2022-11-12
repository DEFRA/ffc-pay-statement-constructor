const getLatestPayment = require('../../../../app/processing/payment/get-latest-payment')
const { DATE } = require('../../../mock-components/mock-dates').DUE
let paymentRequest
let settlement
let lastSettlement
let supportingSettlements
let instalmentValue

describe('get latest payment', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    paymentRequest.dueDate = DATE
    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    lastSettlement = undefined
    supportingSettlements = []
    instalmentValue = Math.trunc(paymentRequest.value / 4)
  })

  test('returns invoice number from payment request', () => {
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.invoiceNumber).toBe(paymentRequest.invoiceNumber)
  })

  test('returns due date from payment request', () => {
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.dueDate).toBe(paymentRequest.dueDate)
  })

  test('returns value from settlement if last settlement undefined', () => {
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(settlement.value)
  })

  test('returns value from settlement if last settlement null', () => {
    lastSettlement = null
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(settlement.value)
  })

  test('returns value from settlement if last settlement value undefined', () => {
    lastSettlement = {}
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(settlement.value)
  })

  test('returns value from settlement if last settlement value null', () => {
    lastSettlement = { value: null }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(settlement.value)
  })

  test('returns value from settlement if last settlement value 0', () => {
    lastSettlement = { value: 0 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(settlement.value)
  })

  test('returns difference between current and last settlement if > 0', () => {
    lastSettlement = { value: 10000 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(40000)
  })

  test('returns difference between current and last settlement if supporting settlements null', () => {
    supportingSettlements = null
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(settlement.value)
  })

  test('returns difference between current and last settlement if supporting settlements undefined', () => {
    supportingSettlements = undefined
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(settlement.value)
  })

  test('returns value including supporting settlement top up', () => {
    supportingSettlements = [{ value: 10000 }]
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(60000)
  })

  test('returns value including supporting settlement downward adjustment', () => {
    supportingSettlements = [{ value: -10000 }]
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(40000)
  })

  test('returns value including top up and downward adjustment', () => {
    supportingSettlements = [{ value: 10000 }, { value: -5000 }]
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(55000)
  })

  test('returns value including multiple supporting settlements', () => {
    supportingSettlements = [{ value: 10000 }, { value: -5000 }, { value: 20000 }]
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.value).toBe(75000)
  })

  test('returns period if last settlement undefined and one instalment settled', () => {
    settlement.value = instalmentValue
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('September to November 2022')
  })

  test('returns period if last settlement null and one instalment settled', () => {
    settlement.value = instalmentValue
    lastSettlement = null
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('September to November 2022')
  })

  test('returns period if last settlement undefined and one instalment settled', () => {
    settlement.value = instalmentValue
    lastSettlement = {}
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('September to November 2022')
  })

  test('returns period if last settlement value null and one instalment settled', () => {
    settlement.value = instalmentValue
    lastSettlement = { value: null }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('September to November 2022')
  })

  test('returns period if last settlement value empty and one instalment settled', () => {
    settlement.value = instalmentValue
    lastSettlement = { value: '' }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('September to November 2022')
  })

  test('returns period if last settlement value 0 and one instalment settled', () => {
    settlement.value = instalmentValue
    lastSettlement = { value: 0 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('September to November 2022')
  })

  test('returns period if first instalment settled and next instalment settled', () => {
    settlement.value = instalmentValue * 2
    lastSettlement = { value: instalmentValue }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('December to February 2023')
  })

  test('returns period if first two instalments settled and next instalment settled', () => {
    settlement.value = instalmentValue * 3
    lastSettlement = { value: instalmentValue * 2 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('March to May 2023')
  })

  test('returns period if first three instalments settled and next instalment settled', () => {
    settlement.value = instalmentValue * 4
    lastSettlement = { value: instalmentValue * 3 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('June to August 2023')
  })

  test('returns period if last settlement value 0 and two instalment settled', () => {
    settlement.value = instalmentValue * 2
    lastSettlement = { value: 0 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('September to February 2023')
  })

  test('returns period if first instalment settled and next two instalments settled', () => {
    settlement.value = instalmentValue * 3
    lastSettlement = { value: instalmentValue }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('December to May 2023')
  })

  test('returns period if first two settled and next two instalments settled', () => {
    settlement.value = instalmentValue * 4
    lastSettlement = { value: instalmentValue * 2 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('March to August 2023')
  })

  test('returns period if last settlement value 0 and three instalments settled', () => {
    settlement.value = instalmentValue * 3
    lastSettlement = { value: 0 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('September to May 2023')
  })

  test('returns period if first instalment settled and next three instalments settled', () => {
    settlement.value = instalmentValue * 4
    lastSettlement = { value: instalmentValue }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('December to August 2023')
  })

  test('returns period if last settlement value 0 and four instalments settled', () => {
    settlement.value = instalmentValue * 4
    lastSettlement = { value: 0 }
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement)
    expect(result.period).toBe('September to August 2023')
  })

  test('returns period as dueDate month if schedule null', () => {
    paymentRequest.schedule = null
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.period).toBe('December 2022')
  })

  test('returns period as dueDate month if schedule undefined', () => {
    paymentRequest.schedule = undefined
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.period).toBe('December 2022')
  })

  test('returns period as dueDate month if schedule false', () => {
    paymentRequest.schedule = false
    const result = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    expect(result.period).toBe('December 2022')
  })
})
