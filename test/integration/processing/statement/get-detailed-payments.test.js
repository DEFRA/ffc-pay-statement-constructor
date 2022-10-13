const getDetailedPayments = require('../../../../app/processing/statement/components/get-detailed-payments')

let mockCalculation, mockPaymentRequest, mockSettlement

describe('format dates', () => {
  beforeEach(async () => {
    mockCalculation = { calculated: JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation').rawCalculationData.calculationDate)) } // '01/12/2022'
    mockSettlement = { settlementDate: JSON.parse(JSON.stringify(require('../../../mock-settlement').settlementDate)) } // 'Tue Feb 08 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    mockPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-payment-request').processingPaymentRequest)) // '01/12/2022'
  })

  test('dueDate is formatted as "1 December 2022"', async () => {
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('settled date is formatted as "8 February 2022"', async () => {
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].settled).toBe('8 February 2022')
  })

  test('calculated date is formatted as "1 December 2022"', async () => {
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].calculated).toBe('1 December 2022')
  })
})
