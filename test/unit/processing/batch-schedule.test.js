
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

jest.mock('../../../app/processing/schedule/get-scheduled-settlements')
const getScheduledSettlements = require('../../../app/processing/schedule/get-scheduled-settlements')

jest.mock('../../../app/processing/schedule/validate-scheduled-settlement')
const validateScheduledSettlement = require('../../../app/processing/schedule/validate-scheduled-settlement')

jest.mock('../../../app/processing/schedule/update-scheduled-settlements-by-schedule-ids')
const updateScheduledSettlementsByScheduleId = require('../../../app/processing/schedule/update-scheduled-settlements-by-schedule-ids')

const moment = require('moment')
const batchSchedule = require('../../../app/processing/schedule/batch-schedule')

let mockStarted
let retreivedSchedules

describe('batch schedule', () => {
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
    validateScheduledSettlement.mockReturnValue(retreivedSchedules[0])
      .mockReturnValueOnce(retreivedSchedules[0])
      .mockReturnValueOnce(retreivedSchedules[1])
    updateScheduledSettlementsByScheduleId.mockResolvedValue(undefined)
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

  test('should call validateScheduledSettlement', async () => {
    await batchSchedule()
    expect(validateScheduledSettlement).toHaveBeenCalled()
  })

  test('should call validateScheduledSettlement twice when getScheduledSettlements returns 2 schedule records', async () => {
    await batchSchedule()
    expect(validateScheduledSettlement).toHaveBeenCalledTimes(2)
  })

  test('should call validateScheduledSettlement with each retreivedSchedules when getScheduledSettlements returns 2 schedule records', async () => {
    await batchSchedule()
    expect(validateScheduledSettlement).toHaveBeenCalledWith(retreivedSchedules[0])
    expect(validateScheduledSettlement).toHaveBeenCalledWith(retreivedSchedules[1])
  })

  test('should call updateScheduledSettlementsByScheduleId', async () => {
    await batchSchedule()
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduledSettlementsByScheduleId twice when getScheduledSettlements returns 2 valid schedule records', async () => {
    await batchSchedule()
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledTimes(2)
  })

  test('should call updateScheduledSettlementsByScheduleId with each retreivedSchedules.scheduleId, new Date() and mockTransaction when getScheduledSettlements returns 2 valid schedule records', async () => {
    await batchSchedule()
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledWith(retreivedSchedules[0].scheduleId, new Date(), mockTransaction)
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledWith(retreivedSchedules[1].scheduleId, new Date(), mockTransaction)
  })

  test('should call mockTransaction.commit', async () => {
    await batchSchedule()
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once', async () => {
    await batchSchedule()
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should return retreivedSchedules when getScheduledSettlements returns 2 valid schedule records', async () => {
    const result = await batchSchedule()
    expect(result).toStrictEqual(retreivedSchedules)
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

  test('should not call validateScheduledSettlement when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule() } catch { }
    expect(validateScheduledSettlement).not.toHaveBeenCalled()
  })

  test('should not call updateScheduledSettlementsByScheduleId when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule() } catch { }
    expect(updateScheduledSettlementsByScheduleId).not.toHaveBeenCalled()
  })

  test('should not call mockTransaction.commit when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule() } catch { }
    expect(mockTransaction.commit).not.toHaveBeenCalled()
  })

  test('should not throw when validateScheduledSettlement throws', async () => {
    validateScheduledSettlement.mockRejectedValue(new Error('Joi validation issue'))

    const wrapper = async () => {
      await batchSchedule()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call updateScheduledSettlementsByScheduleId when validateScheduledSettlement throws and then resolves', async () => {
    validateScheduledSettlement.mockRejectedValue(new Error('Joi validation issue'))
      .mockResolvedValue(retreivedSchedules[1])

    await batchSchedule()

    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduledSettlementsByScheduleId once when validateScheduledSettlement throws and then resolves', async () => {
    validateScheduledSettlement.mockRejectedValue(new Error('Joi validation issue'))
      .mockResolvedValue(retreivedSchedules[1])

    await batchSchedule()

    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduledSettlementsByScheduleId with resolved schedule.scheduleId, new Date() and mockTransaction when validateScheduledSettlement throws and then resolves', async () => {
    validateScheduledSettlement.mockRejectedValue(new Error('Joi validation issue'))
      .mockResolvedValue(retreivedSchedules[1])

    await batchSchedule()

    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledWith(retreivedSchedules[1].scheduleId, new Date(), mockTransaction)
  })

  test('should call mockTransaction.commit when validateScheduledSettlement throws and then resolves', async () => {
    validateScheduledSettlement.mockRejectedValue(new Error('Joi validation issue'))
      .mockResolvedValue(retreivedSchedules[1])

    await batchSchedule()

    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when validateScheduledSettlement throws and then resolves', async () => {
    validateScheduledSettlement.mockRejectedValue(new Error('Joi validation issue'))
    validateScheduledSettlement.mockResolvedValue(retreivedSchedules[1])

    await batchSchedule()

    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
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
    try { await batchSchedule() } catch {}
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await batchSchedule() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements when a started time is given', async () => {
    console.error(mockStarted)
    await batchSchedule(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalled()
  })

  test('should call getScheduledSettlements once when a started time is given', async () => {
    console.error(mockStarted)
    await batchSchedule(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements with mockStarted and mockTransaction when a started time is given', async () => {
    console.error(mockStarted)
    await batchSchedule(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalledWith(mockStarted, mockTransaction)
  })
})
