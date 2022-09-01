
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

jest.mock('../../../app/processing/get-scheduled-settlements')
const getScheduledSettlements = require('../../../app/processing/get-scheduled-settlements')

jest.mock('../../../app/processing/schema')
const schema = require('../../../app/processing/schema')

jest.mock('../../../app/processing/update-scheduled-settlements-by-schedule-ids')
const updateScheduledSettlementsByScheduleId = require('../../../app/processing/update-scheduled-settlements-by-schedule-ids')

const moment = require('moment')
const processScheduledSettlements = require('../../../app/processing/process-scheduled-settlements')

let mockStarted
let retreivedSchedules

describe('process scheduled settlements', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))

    mockCommit.mockResolvedValue(undefined)
    mockRollback.mockResolvedValue(undefined)

    mockStarted = moment(new Date()).subtract(30000)

    const schedule = JSON.parse(JSON.stringify(require('../../mock-schedule')))

    const retreivedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }

    retreivedSchedules = [
      { ...retreivedSchedule },
      { ...retreivedSchedule, scheduleId: 2 }
    ]

    getScheduledSettlements.mockResolvedValue(retreivedSchedules)
    schema.validate
      .mockReturnValue({ value: retreivedSchedules[0] })
      .mockReturnValueOnce({ value: retreivedSchedules[0] })
      .mockReturnValueOnce({ value: retreivedSchedules[1] })
    updateScheduledSettlementsByScheduleId.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getScheduledSettlements', async () => {
    await processScheduledSettlements()
    expect(getScheduledSettlements).toHaveBeenCalled()
  })

  test('should call getScheduledSettlements once', async () => {
    await processScheduledSettlements()
    expect(getScheduledSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements with new Date() and mockTransaction', async () => {
    await processScheduledSettlements()
    expect(getScheduledSettlements).toHaveBeenCalledWith(new Date(), mockTransaction)
  })

  test('should call schema.validate', async () => {
    await processScheduledSettlements()
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate twice when getScheduledSettlements returns 2 schedule records', async () => {
    await processScheduledSettlements()
    expect(schema.validate).toHaveBeenCalledTimes(2)
  })

  test('should call schema.validate with each retreivedSchedules and { abortEarly: false }', async () => {
    await processScheduledSettlements()
    expect(schema.validate).toHaveBeenCalledWith(retreivedSchedules[0], { abortEarly: false })
    expect(schema.validate).toHaveBeenCalledWith(retreivedSchedules[1], { abortEarly: false })
  })

  test('should call updateScheduledSettlementsByScheduleId', async () => {
    await processScheduledSettlements()
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduledSettlementsByScheduleId twice when getScheduledSettlements returns 2 valid schedule records', async () => {
    await processScheduledSettlements()
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledTimes(2)
  })

  test('should call updateScheduledSettlementsByScheduleId with each retreivedSchedules.scheduleId, new Date() and mockTransaction', async () => {
    await processScheduledSettlements()
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledWith(retreivedSchedules[0].scheduleId, new Date(), mockTransaction)
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledWith(retreivedSchedules[1].scheduleId, new Date(), mockTransaction)
  })

  test('should call mockTransaction.commit', async () => {
    await processScheduledSettlements()
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once', async () => {
    await processScheduledSettlements()
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should return retreivedSchedules when getScheduledSettlements returns 2 valid schedule records', async () => {
    const result = await processScheduledSettlements()
    expect(result).toStrictEqual(retreivedSchedules)
  })

  test('should not throw when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processScheduledSettlements()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processScheduledSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processScheduledSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not throw when updateScheduledSettlementsByScheduleId throws', async () => {
    updateScheduledSettlementsByScheduleId.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processScheduledSettlements()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when updateScheduledSettlementsByScheduleId throws', async () => {
    updateScheduledSettlementsByScheduleId.mockRejectedValue(new Error('Database save down issue'))
    try { await processScheduledSettlements() } catch {}
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when updateScheduledSettlementsByScheduleId throws', async () => {
    updateScheduledSettlementsByScheduleId.mockRejectedValue(new Error('Database save down issue'))
    try { await processScheduledSettlements() } catch {}
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processScheduledSettlements()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processScheduledSettlements() } catch {}
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processScheduledSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements when a started time is given', async () => {
    console.error(mockStarted)
    await processScheduledSettlements(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalled()
  })

  test('should call getScheduledSettlements once when a started time is given', async () => {
    console.error(mockStarted)
    await processScheduledSettlements(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements with mockStarted and mockTransaction when a started time is given', async () => {
    console.error(mockStarted)
    await processScheduledSettlements(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalledWith(mockStarted, mockTransaction)
  })
})
