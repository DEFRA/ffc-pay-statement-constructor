jest.mock('../../../app/processing/settlement/schema')
const schema = require('../../../app/processing/settlement/schema')

jest.mock('../../../app/processing/settlement/get-settled-settlement-by-settlement-id')
const getSettledSettlementBySettlementId = require('../../../app/processing/settlement/get-settled-settlement-by-settlement-id')

const getSettlement = require('../../../app/processing/settlement/get-settlement')

let retreivedSettlement

describe('get required settlement information for building a statement object', () => {
  beforeEach(() => {
    const settlement = JSON.parse(JSON.stringify(require('../../mock-settlement')))

    retreivedSettlement = {
      paymentRequestId: 1,
      reference: settlement.reference,
      settled: settlement.settled
    }

    schema.validate.mockReturnValue({ value: retreivedSettlement })
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

  test('should call schema.validate when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call schema.validate with retreivedSettlement and { abortEarly: false } when a settlementId is given', async () => {
    const settlementId = 1
    await getSettlement(settlementId)
    expect(schema.validate).toHaveBeenCalledWith(retreivedSettlement, { abortEarly: false })
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

  test('should not call schema.validate when getSettledSettlementBySettlementId throws', async () => {
    const settlementId = 1
    getSettledSettlementBySettlementId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getSettlement(settlementId) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    const settlementId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    const settlementId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Settlement with settlementId: 1 does not have the required data" when schema.validate returns with error key of "Joi validation issue"', async () => {
    const settlementId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getSettlement(settlementId)
    }

    expect(wrapper).rejects.toThrow(/^Settlement with settlementId: 1 does not have the required data/)
  })
})
