const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../../app/processing/schedule/get-scheduled-settlements')
const getScheduledSettlements = require('../../../../app/processing/schedule/get-scheduled-settlements')

jest.mock('../../../../app/processing/schedule/get-valid-scheduled-settlements')
const getValidScheduledSettlements = require('../../../../app/processing/schedule/get-valid-scheduled-settlements')

jest.mock('../../../../app/processing/schedule/update-scheduled-settlement-by-schedule-id')
const updateScheduledSettlementByScheduleId = require('../../../../app/processing/schedule/update-scheduled-settlement-by-schedule-id')

const batchSchedule = require('../../../../app/processing/schedule/batch-schedule')

let retreivedSchedules

describe('batch schedule', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))

    mockCommit.mockResolvedValue(undefined)
    mockRollback.mockResolvedValue(undefined)

    const schedule = JSON.parse(JSON.stringify(require('../../../mock-schedule')))

    const retreivedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }

    retreivedSchedules = [
      { ...retreivedSchedule },
      { ...retreivedSchedule, scheduleId: 2 }
    ]

    getScheduledSettlements.mockResolvedValue(retreivedSchedules)
    getValidScheduledSettlements.mockReturnValue(retreivedSchedules)
    updateScheduledSettlementByScheduleId.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getScheduledSettlements', async () => {
    await batchSchedule()
    expect(getScheduledSettlements).toHaveBeenCalled()
  })

  test('should call getScheduledSettlements once', async () => {
    await batchSchedule()
    expect(getScheduledSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements with new Date() and mockTransaction', async () => {
    await batchSchedule()
    expect(getScheduledSettlements).toHaveBeenCalledWith(new Date(), mockTransaction)
  })

  test('should call getValidScheduledSettlements', async () => {
    await batchSchedule()
    expect(getValidScheduledSettlements).toHaveBeenCalled()
  })

  test('should call getValidScheduledSettlements once when getScheduledSettlements returns 2 schedule records', async () => {
    await batchSchedule()
    expect(getValidScheduledSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getValidScheduledSettlements with each retreivedSchedules when getScheduledSettlements returns 2 schedule records', async () => {
    await batchSchedule()
    expect(getValidScheduledSettlements).toHaveBeenCalledWith(retreivedSchedules)
  })

  test('should call updateScheduledSettlementByScheduleId', async () => {
    await batchSchedule()
    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduledSettlementByScheduleId twice when getValidScheduledSettlements returns 2 schedules', async () => {
    await batchSchedule()
    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledTimes(2)
  })

  test('should call updateScheduledSettlementByScheduleId with each retreivedSchedules.scheduleId, new Date() and mockTransaction when getScheduledSettlements returns 2 valid schedule records', async () => {
    await batchSchedule()
    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledWith(retreivedSchedules[0].scheduleId, new Date(), mockTransaction)
    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledWith(retreivedSchedules[1].scheduleId, new Date(), mockTransaction)
  })

  test('should call mockTransaction.commit', async () => {
    await batchSchedule()
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once', async () => {
    await batchSchedule()
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should return retreivedSchedules', async () => {
    const result = await batchSchedule()
    expect(result).toStrictEqual(retreivedSchedules)
  })

  test('should not call mockTransaction.rollback', async () => {
    await batchSchedule()
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should not throw when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await batchSchedule()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not call getValidScheduledSettlements when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule() } catch { }
    expect(getValidScheduledSettlements).not.toHaveBeenCalled()
  })

  test('should not call updateScheduledSettlementByScheduleId when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule() } catch { }
    expect(updateScheduledSettlementByScheduleId).not.toHaveBeenCalled()
  })

  test('should not call mockTransaction.commit when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule() } catch { }
    expect(mockTransaction.commit).not.toHaveBeenCalled()
  })

  test('should not throw when getValidScheduledSettlements throws', async () => {
    getValidScheduledSettlements.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await batchSchedule()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when getValidScheduledSettlements throws', async () => {
    getValidScheduledSettlements.mockImplementation(() => { throw Error('Joi validation issue') })
    await batchSchedule()
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getValidScheduledSettlements throws', async () => {
    getValidScheduledSettlements.mockImplementation(() => { throw Error('Joi validation issue') })
    await batchSchedule()
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not call updateScheduledSettlementByScheduleId when getValidScheduledSettlements throws', async () => {
    getValidScheduledSettlements.mockImplementation(() => { throw Error('Joi validation issue') })
    await batchSchedule()
    expect(updateScheduledSettlementByScheduleId).not.toHaveBeenCalled()
  })

  test('should not call mockTransaction.commit when getValidScheduledSettlements throws', async () => {
    getValidScheduledSettlements.mockImplementation(() => { throw Error('Joi validation issue') })
    await batchSchedule()
    expect(mockTransaction.commit).not.toHaveBeenCalled()
  })

  test('should not throw when updateScheduledSettlementByScheduleId throws', async () => {
    updateScheduledSettlementByScheduleId.mockRejectedValue(new Error('Database update issue'))

    const wrapper = async () => {
      await batchSchedule()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.commit when updateScheduledSettlementByScheduleId throws', async () => {
    updateScheduledSettlementByScheduleId.mockRejectedValue(new Error('Database update issue'))
    await batchSchedule()
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when updateScheduledSettlementByScheduleId throws', async () => {
    updateScheduledSettlementByScheduleId.mockRejectedValue(new Error('Database update issue'))
    await batchSchedule()
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not return the corresponding thrown schedule when updateScheduledSettlementByScheduleId throws then resolves', async () => {
    updateScheduledSettlementByScheduleId.mockReset()
      .mockRejectedValueOnce(new Error('Database update issue'))
      .mockResolvedValueOnce(retreivedSchedules[1])

    const result = await batchSchedule()

    expect(result).not.toStrictEqual([retreivedSchedules[0]])
  })

  test('should return the corresponding resolved schedule when updateScheduledSettlementByScheduleId throws then resolves', async () => {
    updateScheduledSettlementByScheduleId.mockReset()
      .mockRejectedValueOnce(new Error('Database update issue'))
      .mockResolvedValueOnce(retreivedSchedules[1])

    const result = await batchSchedule()

    expect(result).toStrictEqual([retreivedSchedules[1]])
  })

  test('should return an empty array if both schedules passed to updateScheduledSettlementByScheduleId throw', async () => {
    updateScheduledSettlementByScheduleId.mockReset()
      .mockRejectedValueOnce(new Error('Database update issue'))
      .mockRejectedValueOnce(new Error('Database update issue'))

    const result = await batchSchedule()

    expect(result).toStrictEqual([])
  })

  test('should not throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await batchSchedule()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await batchSchedule() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await batchSchedule() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})
