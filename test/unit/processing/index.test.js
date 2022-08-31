jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')

jest.mock('../../../app/config')
const { processingConfig } = require('../../../app/config')

jest.mock('../../../app/processing/process-settlements')
const processSettlements = require('../../../app/processing/process-settlements')

const processing = require('../../../app/processing')

describe('start processing', () => {
  beforeEach(() => {
    processingConfig.settlementProcessingInterval = 10000
    processSettlements.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processSettlements', async () => {
    await processing.start()
    expect(processSettlements).toHaveBeenCalled()
  })

  test('should call processSettlements once', async () => {
    await processing.start()
    expect(processSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout', async () => {
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once', async () => {
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval', async () => {
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })

  test('should not throw when processSettlements throws', async () => {
    processSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processing.start()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call setTimeout when processSettlements throws', async () => {
    processSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once when processSettlements throws', async () => {
    processSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval when processSettlements throws', async () => {
    processSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })
})
