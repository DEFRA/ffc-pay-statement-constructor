jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')

jest.mock('../../../app/config')
const { processingConfig } = require('../../../app/config')

jest.mock('../../../app/processing/schedule/batch-schedule')
const batchSchedule = require('../../../app/processing/schedule/batch-schedule')

const processing = require('../../../app/processing')

describe('start processing', () => {
  beforeEach(() => {
    processingConfig.settlementProcessingInterval = 10000
    batchSchedule.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call batchSchedule', async () => {
    await processing.start()
    expect(batchSchedule).toHaveBeenCalled()
  })

  test('should call batchSchedule once', async () => {
    await processing.start()
    expect(batchSchedule).toHaveBeenCalledTimes(1)
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

  test('should not throw when batchSchedule throws', async () => {
    batchSchedule.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processing.start()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call setTimeout when batchSchedule throws', async () => {
    batchSchedule.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once when batchSchedule throws', async () => {
    batchSchedule.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval when batchSchedule throws', async () => {
    batchSchedule.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })
})
