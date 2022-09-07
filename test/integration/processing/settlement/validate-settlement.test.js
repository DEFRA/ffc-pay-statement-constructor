const validateSettlement = require('../../../../app/processing/settlement/validate-settlement')

let retreivedSettlement

describe('validate settlement', () => {
  beforeEach(() => {
    const settlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
    retreivedSettlement = {
      paymentRequestId: 1,
      reference: settlement.reference,
      settled: settlement.settled
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retreivedSettlement', async () => {
    const result = validateSettlement(retreivedSettlement)
    expect(result).toStrictEqual(retreivedSettlement)
  })

  test('should throw when retreivedSettlement is missing required paymentRequestId', async () => {
    delete retreivedSettlement.paymentRequestId

    const wrapper = async () => {
      validateSettlement(retreivedSettlement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retreivedSettlement is missing required paymentRequestId', async () => {
    delete retreivedSettlement.paymentRequestId

    const wrapper = async () => {
      validateSettlement(retreivedSettlement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "paymentRequestId" is required" when retreivedSettlement is missing required paymentRequestId', async () => {
    delete retreivedSettlement.paymentRequestId

    const wrapper = async () => {
      validateSettlement(retreivedSettlement)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "paymentRequestId" is required/)
  })

  test('should throw when retreivedSettlement is missing required reference', async () => {
    delete retreivedSettlement.reference

    const wrapper = async () => {
      validateSettlement(retreivedSettlement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retreivedSettlement is missing required reference', async () => {
    delete retreivedSettlement.reference

    const wrapper = async () => {
      validateSettlement(retreivedSettlement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "reference" is required" when retreivedSettlement is missing required reference', async () => {
    delete retreivedSettlement.reference

    const wrapper = async () => {
      validateSettlement(retreivedSettlement)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "reference" is required/)
  })

  test('should throw when retreivedSettlement is missing required settled', async () => {
    delete retreivedSettlement.settled

    const wrapper = async () => {
      validateSettlement(retreivedSettlement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when retreivedSettlement is missing required settled', async () => {
    delete retreivedSettlement.settled

    const wrapper = async () => {
      validateSettlement(retreivedSettlement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which ends "does not have the required data: "settled" is required" when retreivedSettlement is missing required settled', async () => {
    delete retreivedSettlement.settled

    const wrapper = async () => {
      validateSettlement(retreivedSettlement)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data: "settled" is required/)
  })
})
