const mapCalculation = require('../../../../app/processing/calculation/map-calculation')

let retrievedCalculation
let mappedCalculation

describe('map calculation information for building a statement object', () => {
  beforeEach(() => {
    retrievedCalculation = JSON.parse(JSON.stringify(require('../../../mock-calculation')))

    mappedCalculation = {
      calculationId: retrievedCalculation.calculationId,
      sbi: retrievedCalculation.sbi,
      calculated: retrievedCalculation.calculationDate,
      invoiceNumber: retrievedCalculation.invoiceNumber,
      paymentRequestId: retrievedCalculation.paymentRequestId
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return mappedCalculation when a valid calculation is given', async () => {
    const result = await mapCalculation(retrievedCalculation)
    expect(result).toStrictEqual(mappedCalculation)
  })
})
