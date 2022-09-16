jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')

jest.mock('../../../app/config')
const { processingConfig } = require('../../../app/config')

const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}
jest.mock('../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../app/processing/schedule')
const schedulePendingSettlements = require('../../../app/processing/schedule')

jest.mock('../../../app/processing/statement')
const { getStatement, sendStatement } = require('../../../app/processing/statement')

const processing = require('../../../app/processing')

let retreivedSchedule
let statement

describe('start processing', () => {
  beforeEach(() => {
    processingConfig.settlementProcessingInterval = 10000

    const schedule = JSON.parse(JSON.stringify(require('../../mock-schedule')))
    retreivedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }
    statement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-statement')))

    schedulePendingSettlements.mockResolvedValue([retreivedSchedule])
    getStatement.mockResolvedValue(statement)
    sendStatement.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call schedulePendingSettlements', async () => {
    await processing.start()
    expect(schedulePendingSettlements).toHaveBeenCalled()
  })

  test('should call schedulePendingSettlements once', async () => {
    await processing.start()
    expect(schedulePendingSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getStatement when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(getStatement).toHaveBeenCalled()
  })

  test('should call getStatement once when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(getStatement).toHaveBeenCalledTimes(1)
  })

  test('should call getStatement with schedulePendingSettlements()[0].settlementId and mockTransaction when schedulePendingSettlements returns 1 record', async () => {
    await processing.start()
    expect(getStatement).toHaveBeenCalledWith((await schedulePendingSettlements())[0].settlementId, mockTransaction)
  })

  test('should call getStatement when schedulePendingSettlements returns 2 records', async () => {
    schedulePendingSettlements.mockResolvedValue([retreivedSchedule, retreivedSchedule])
    await processing.start()
    expect(getStatement).toHaveBeenCalled()
  })

  test('should call getStatement twice when schedulePendingSettlements returns 2 records', async () => {
    schedulePendingSettlements.mockResolvedValue([retreivedSchedule, retreivedSchedule])
    await processing.start()
    expect(getStatement).toHaveBeenCalledTimes(2)
  })

  test('should call getStatement with each schedulePendingSettlements().settlementId and mockTransaction when schedulePendingSettlements returns 2 records', async () => {
    schedulePendingSettlements.mockResolvedValue([retreivedSchedule, retreivedSchedule])

    await processing.start()

    expect(getStatement).toHaveBeenNthCalledWith(1, (await schedulePendingSettlements())[0].settlementId, mockTransaction)
    expect(getStatement).toHaveBeenNthCalledWith(2, (await schedulePendingSettlements())[1].settlementId, mockTransaction)
  })

  test('should not call getStatement when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])
    await processing.start()
    expect(getStatement).not.toHaveBeenCalled()
  })

  test('should not throw when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processing.start()
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])

    const wrapper = async () => {
      await processing.start()
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when getStatement throws', async () => {
    getStatement.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processing.start()
    }

    expect(wrapper).not.toThrow()
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

  test('should call setTimeout when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })

  test('should call setTimeout when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })

  test('should call setTimeout when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])
    await processing.start()
    expect(setTimeout).toHaveBeenCalled()
  })

  test('should call setTimeout once when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])
    await processing.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should call setTimeout with processing.start and processingConfig.settlementProcessingInterval when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])
    await processing.start()
    expect(setTimeout).toHaveBeenCalledWith(processing.start, processingConfig.settlementProcessingInterval)
  })
})
