
jest.mock('../../../../app/processing/funding/get-fundings-by-calculation-id')
const getFundingsByCalculationId = require('../../../../app/processing/funding/get-fundings-by-calculation-id')

jest.mock('../../../../app/processing/funding/fundings-schema')
const schema = require('../../../../app/processing/funding/fundings-schema')

const getFundings = require('../../../../app/processing/funding/get-fundings')
let rawFundingsData

describe('get and transform fundings object for building a statement object', () => {
  beforeEach(() => {
    const retrievedFundingsData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings').rawFundingsData))

    rawFundingsData = retrievedFundingsData
    getFundingsByCalculationId.mockResolvedValue(rawFundingsData)

    rawFundingsData = retrievedFundingsData
    getFundingsByCalculationId.mockResolvedValue(rawFundingsData)

    schema.validate.mockReturnValue({ value: rawFundingsData })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getFundingsByCalculationId when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(getFundingsByCalculationId).toHaveBeenCalled()
  })

  test('should call getFundingsByCalculationId once when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(getFundingsByCalculationId).toHaveBeenCalledTimes(1)
  })

  test('should call getFundingsByCalculationId with calculationId when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(getFundingsByCalculationId).toHaveBeenCalledWith(calculationId)
  })

  test('should call schema.validate when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call schema.validate with rawFundingsData and { abortEarly: false } when a calculationId is given', async () => {
    const calculationId = 1
    await getFundings(calculationId)
    expect(schema.validate).toHaveBeenCalledWith(rawFundingsData, { abortEarly: false })
  })

  test('should throw when getFundingsByCalculationId throws', async () => {
    const calculationId = 1
    getFundingsByCalculationId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getFundingsByCalculationId throws Error', async () => {
    const calculationId = 1
    getFundingsByCalculationId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should not call schema.validate when getFundingsByCalculationId throws', async () => {
    const calculationId = 1
    getFundingsByCalculationId.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getFundings(calculationId) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    const calculationId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    const calculationId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Calculation with calculationId: 1 does not have valid funding(s)" when schema.validate returns with error key of "Joi validation issue"', async () => {
    const calculationId = 1
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(/^Calculation with calculationId: 1 does not have valid funding/)
  })

  test('should return all records retrieved from database when getFundingsByCalculationId and all retrieved records are valid', async () => {
    const calculationId = 1
    const fundings = await getFundings(calculationId)
    expect(fundings.length).toBe(rawFundingsData.length)
  })

  test('should return areas attribute for all records retrieved from database when getFundingsByCalculationId and all retrieved records are valid', async () => {
    const calculationId = 1
    const fundings = await getFundings(calculationId)
    const areas = fundings.filter(funding => funding.area !== undefined).map(funding => funding.area)
    expect(areas.length).toBe(rawFundingsData.length)
  })

  test('should return rate attribute for all records retrieved from database when getFundingsByCalculationId and all retrieved records are valid', async () => {
    const calculationId = 1
    const fundings = await getFundings(calculationId)
    const rates = fundings.filter(funding => funding.rate !== undefined).map(funding => funding.rate)
    expect(rates.length).toBe(rawFundingsData.length)
  })

  test('should not return areaClaimed as attribute for any record retrieved from database when getFundingsByCalculationId and all retrieved records are valid', async () => {
    const calculationId = 1
    const fundings = await getFundings(calculationId)
    const areasClaimed = fundings.filter(funding => funding.areaClaimed !== undefined).map(funding => funding.areaClaimed)
    expect(areasClaimed.length).toBe(0)
  })
})
