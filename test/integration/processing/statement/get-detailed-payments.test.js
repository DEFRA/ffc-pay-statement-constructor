const getDetailedPayments = require('../../../../app/processing/statement/components/get-detailed-payments')

let mockCalculation, mockPaymentRequest, mockSettlement

// expected date formats
// 'DD/MM/YYYY' 01/12/2022
// ddd MMM DD YYYY HH:mm:ss Tue Feb 08 2022 00:00:00

describe('format dates', () => {
  beforeEach(async () => {
    mockPaymentRequest = JSON.parse(JSON.stringify(require('../../../mock-payment-request').processingPaymentRequest)) // '01/12/2022'
    mockSettlement = { settlementDate: JSON.parse(JSON.stringify(require('../../../mock-settlement').settlementDate)) } // 'Tue Feb 08 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    mockCalculation = { calculated: JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation').rawCalculationData.calculationDate)) } // '01/12/2022'
  })

  test('mockPaymentRequest dueDate with format of "DD/MM/YYYY" should return "1 December 2022"', async () => {
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('mockPaymentRequest dueDate with format of "DD-MM-YYYY" should return "1 December 2022"', async () => {
    mockPaymentRequest.dueDate = '01-12-2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YYYY" should return "1 December 2022"', async () => {
    mockPaymentRequest.dueDate = '1/12/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YY" should return "1 December 2022"', async () => {
    mockPaymentRequest.dueDate = '1/12/22'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('mockPaymentRequest dueDate with format of "ddd MMM DD YYYY HH:mm:ss" should return "1 December 2022"', async () => {
    mockPaymentRequest.dueDate = 'Thu Dec 01 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 December 2022')
  })

  test('mockPaymentRequest dueDate with format of "DD/MM/YYYY" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = '01/06/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  test('mockPaymentRequest dueDate with format of "DD-MM-YYYY" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = '01-06-2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YYYY" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = '1/6/2022'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  test('mockPaymentRequest dueDate with format of "D/MM/YY" should return "1 June 2022"', async () => {
    mockPaymentRequest.dueDate = '1/06/22'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  test('mockPaymentRequest dueDate with format of "ddd MMM DD YYYY HH:mm:ss" should return "1 December 2021"', async () => {
    mockPaymentRequest.dueDate = 'Wed Jun 01 2022 00:00:00 GMT+0000 (Greenwich Mean Time)'
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].dueDate).toBe('1 June 2022')
  })

  test('mockSettlement settled date with format of "ddd MMM DD YYYY HH:mm:ss" should return "8 February 2022"', async () => {
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].settled).toBe('8 February 2022')
  })

  test('mockCalculation calculated date with format of "DD/MM/YYYY" should return "1 December 2022"', async () => {
    const result = await getDetailedPayments(mockCalculation, mockPaymentRequest, mockSettlement)
    expect(result[0].calculated).toBe('1 December 2022')
  })
})
