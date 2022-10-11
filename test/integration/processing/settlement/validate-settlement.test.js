const validateSettlement = require('../../../../app/processing/settlement/validate-settlement')

let retrievedSettlement

describe('validate settlement', () => {
  beforeEach(() => {
    const settlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
    retrievedSettlement = {
      invoiceNumber: settlement.invoiceNumber,
      paymentRequestId: 1,
      reference: settlement.reference,
      settled: settlement.settled,
      settlementDate: new Date(settlement.settlementDate),
      value: settlement.value
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedSettlement', async () => {
    const result = validateSettlement(retrievedSettlement)
    expect(result).toStrictEqual(retrievedSettlement)
  })

  test('should throw when retrievedSettlement is missing required paymentRequestId', async () => {
    delete retrievedSettlement.paymentRequestId

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required paymentRequestId', async () => {
    delete retrievedSettlement.paymentRequestId

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "paymentRequestId" is required" when retrievedSettlement is missing required paymentRequestId', async () => {
    delete retrievedSettlement.paymentRequestId

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "paymentRequestId" is required/)
  })

  test('should throw when retrievedSettlement is missing required reference', async () => {
    delete retrievedSettlement.reference

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required reference', async () => {
    delete retrievedSettlement.reference

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "reference" is required" when retrievedSettlement is missing required reference', async () => {
    delete retrievedSettlement.reference

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "reference" is required/)
  })

  test('should throw when retrievedSettlement is missing required settled', async () => {
    delete retrievedSettlement.settled

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retrievedSettlement is missing required settled', async () => {
    delete retrievedSettlement.settled

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "settled" is required" when retrievedSettlement is missing required settled', async () => {
    delete retrievedSettlement.settled

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "settled" is required/)
  })
})
