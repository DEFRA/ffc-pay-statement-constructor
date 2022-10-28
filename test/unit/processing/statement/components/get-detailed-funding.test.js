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
    expect(result.find(x => x.name === fundings[0].name).area).toBe('5.0000')
  })
})
