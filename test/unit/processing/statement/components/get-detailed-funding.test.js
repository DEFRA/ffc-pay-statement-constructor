jest.mock('../../../../../app/processing/funding')
const mockFunding = require('../../../../../app/processing/funding')
jest.mock('../../../../../app/processing/invoice-line')
const mockInvoiceLine = require('../../../../../app/processing/invoice-line')
const getDetailedFunding = require('../../../../../app/processing/statement/components/get-detailed-funding')

let fundings
let invoiceLine

describe('get detailed funding', () => {
  beforeEach(() => {
    fundings = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-fundings').mappedFundingsData))
    invoiceLine = {
      annualValue: 10000,
      quarterlyValue: 2500,
      quarterlyReduction: 0,
      quarterlyPayment: 2500,
      reductions: []
    }

    mockFunding.mockImplementation(() => [fundings[0]])
    mockInvoiceLine.mockImplementation(() => invoiceLine)
  })

  test('returns detailed fundings for one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.length).toBe(2)
  })

  test('returns funding row for one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === fundings[0].name)).toBeDefined()
  })

  test('returns total row for one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total')).toBeDefined()
  })

  test('returns correct funding row area', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === fundings[0].name).area).toBe(fundings[0].area)
  })

  test('returns correct funding row level', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === fundings[0].name).level).toBe(fundings[0].level)
  })

  test('returns correct funding row name', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === fundings[0].name).name).toBe(fundings[0].name)
  })

  test('returns correct funding row rate', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === fundings[0].name).rate).toBe(fundings[0].rate)
  })

  test('returns correct funding row annualValue', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === fundings[0].name).annualValue).toBe('100.00')
  })

  test('returns correct funding row quarterlyValue', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === fundings[0].name).quarterlyValue).toBe('25.00')
  })

  test('returns correct funding row quarterlyReduction', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === fundings[0].name).quarterlyReduction).toBe('0.00')
  })

  test('returns correct funding row quarterlyPayment', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === fundings[0].name).quarterlyPayment).toBe('25.00')
  })

  test('returns correct total row annualValue when one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').annualValue).toBe('100.00')
  })

  test('returns correct total row quarterlyValue when one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyValue).toBe('25.00')
  })

  test('returns correct total row quarterlyReduction when one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyReduction).toBe('0.00')
  })

  test('returns correct total row quarterlyPayment when one funding option', async () => {
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyPayment).toBe('25.00')
  })

  test('returns correct total row annualValue when multiple funding options', async () => {
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').annualValue).toBe('300.00')
  })

  test('returns correct total row quarterlyValue when multiple funding options', async () => {
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyValue).toBe('75.00')
  })

  test('returns correct total row quarterlyReduction when multiple funding options', async () => {
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyReduction).toBe('0.00')
  })

  test('returns correct total row quarterlyPayment when multiple funding options', async () => {
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyPayment).toBe('75.00')
  })

  test('returns correct total row annualValue when multiple funding options and reductions', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').annualValue).toBe('300.00')
  })

  test('returns correct total row quarterlyValue when multiple funding options and reductions', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyValue).toBe('75.00')
  })

  test('returns correct total row quarterlyReduction when multiple funding options and reductions', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyReduction).toBe('30.00')
  })

  test('returns correct total row quarterlyPayment when multiple funding options and reductions', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyPayment).toBe('45.00')
  })

  test('returns correct total row annualValue when multiple funding options and reductions and invoice lines', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').annualValue).toBe('300.00')
  })

  test('returns correct total row quarterlyValue when multiple funding options and reductions and invoice lines', async () => {
    invoiceLine.quarterlyReduction = 1000
    invoiceLine.quarterlyPayment = 1500
    mockFunding.mockImplementation(() => fundings)
    const result = await getDetailedFunding('calculationId', 'paymentRequestId', 'transaction')
    expect(result.find(x => x.name === 'Total').quarterlyValue).toBe('75.00')
  })
})
