jest.mock('../../../../app/processing/settlement/get-settled-settlement-by-settlement-id')
const getSettledSettlementBySettlementId = require('../../../../app/processing/settlement/get-settled-settlement-by-settlement-id')

jest.mock('../../../../app/processing/settlement/validate-settlement')
const validateSettlement = require('../../../../app/processing/settlement/validate-settlement')

const getSettlement = require('../../../../app/processing/settlement/get-settlement')

let retreivedSettlement

describe('get required settlement information for building a statement object', () => {
  beforeEach(() => {
    const settlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))

    retreivedSettlement = {
      paymentRequestId: 1,
      reference: settlement.reference,
      settled: settlement.settled
    }

    validateSettlement.mockReturnValue(retreivedSettlement)
    getSettledSettlementBySettlementId.mockResolvedValue(retreivedSettlement)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getSettledSettlementBySettlementId when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(getSettledSettlementBySettlementId).toHaveBeenCalled()
  })

  test('should call getSettledSettlementBySettlementId once when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(getSettledSettlementBySettlementId).toHaveBeenCalledTimes(1)
  })

  test('should call getSettledSettlementBySettlementId with settlementId when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(getSettledSettlementBySettlementId).toHaveBeenCalledWith(settlementId)
  })

  test('should call validateSettlement when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(validateSettlement).toHaveBeenCalled()
  })

  test('should call validateSettlement once when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(validateSettlement).toHaveBeenCalledTimes(1)
  })

  test('should call validateSettlement with retreivedSettlement when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(validateSettlement).toHaveBeenCalledWith(retreivedSettlement)
  })

  test('should return retreivedSettlement when a settlementId is given', async () => {
    const settlementId = 1
    const result = await getSettlement(settlementId)
    expect(result).toStrictEqual(retreivedSettlement)
  })

  test('should throw when getSettledSettlementBySettlementId throws', async () => {
    const settlementId = 1
    getSettledSettlementBySettlementId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getSettledSettlementBySettlementId throws Error', async () => {
    const settlementId = 1
    getSettledSettlementBySettlementId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getSettledSettlementBySettlementId throws error with "Database retrieval issue"', async () => {
    const settlementId = 1
    getSettledSettlementBySettlementId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call validateSettlement when getSettledSettlementBySettlementId throws', async () => {
    const settlementId = 1
    getSettledSettlementBySettlementId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getSettlement(settlementId) } catch {}

    expect(validateSettlement).not.toHaveBeenCalled()
  })

  test('should throw when validateSettlement throws', async () => {
    const settlementId = 1
    validateSettlement.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when validateSettlement throws Error', async () => {
    const settlementId = 1
    validateSettlement.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Joi validation issue" when validateSettlement throws error with "Joi validation issue"', async () => {
    const settlementId = 1
    validateSettlement.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(/^Joi validation issue$/)
  })
})
