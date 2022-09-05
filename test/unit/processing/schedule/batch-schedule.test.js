const moment = require('moment')

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

jest.mock('../../../../app/processing/schedule/validate-schedule')
const validateSchedule = require('../../../../app/processing/schedule/validate-schedule')

jest.mock('../../../../app/processing/schedule/update-scheduled-settlement-by-schedule-id')
const updateScheduledSettlementByScheduleId = require('../../../../app/processing/schedule/update-scheduled-settlement-by-schedule-id')

const batchSchedule = require('../../../../app/processing/schedule/batch-schedule')

let mockStarted
let retreivedSchedules

describe('batch schedule', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))

    mockCommit.mockResolvedValue(undefined)
    mockRollback.mockResolvedValue(undefined)

    mockStarted = moment(new Date()).subtract(30000)

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
    validateSchedule.mockImplementation(() => { return retreivedSchedules[0] })
      .mockImplementationOnce(() => { return retreivedSchedules[0] })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })
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

  test('should call validateSchedule', async () => {
    await batchSchedule()
    expect(validateSchedule).toHaveBeenCalled()
  })

  test('should call validateSchedule twice when getScheduledSettlements returns 2 schedule records', async () => {
    await batchSchedule()
    expect(validateSchedule).toHaveBeenCalledTimes(2)
  })

  test('should call validateSchedule with each retreivedSchedules when getScheduledSettlements returns 2 schedule records', async () => {
    await batchSchedule()
    expect(validateSchedule).toHaveBeenCalledWith(retreivedSchedules[0])
    expect(validateSchedule).toHaveBeenCalledWith(retreivedSchedules[1])
  })

  test('should call updateScheduledSettlementByScheduleId', async () => {
    await batchSchedule()
    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduledSettlementByScheduleId twice when getScheduledSettlements returns 2 valid schedule records', async () => {
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

  test('should return retreivedSchedules when getScheduledSettlements returns 2 valid schedule records', async () => {
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

  test('should not call validateSchedule when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule() } catch { }
    expect(validateSchedule).not.toHaveBeenCalled()
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

  test('should not throw when validateSchedule throws', async () => {
    validateSchedule.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await batchSchedule()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call updateScheduledSettlementByScheduleId when validateSchedule throws and then resolves', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule()

    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduledSettlementByScheduleId once when validateSchedule throws and then resolves', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule()

    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduledSettlementByScheduleId with resolved schedule.scheduleId, new Date() and mockTransaction when validateSchedule throws and then resolves', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule()

    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledWith(retreivedSchedules[1].scheduleId, new Date(), mockTransaction)
  })

  test('should call mockTransaction.commit when validateSchedule throws and then resolves', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule()

    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when validateSchedule throws and then resolves', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule()

    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should return resolved schedule when validateSchedule throws and then resolves', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    const result = await batchSchedule()

    expect(result).toStrictEqual([retreivedSchedules[1]])
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
    try { await batchSchedule() } catch {}
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await batchSchedule() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements when a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalled()
  })

  test('should call getScheduledSettlements once when a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements with new mockStarted and mockTransaction when a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalledWith(mockStarted, mockTransaction)
  })

  test('should call validateSchedule when a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(validateSchedule).toHaveBeenCalled()
  })

  test('should call validateSchedule twice when getScheduledSettlements returns 2 schedule records and a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(validateSchedule).toHaveBeenCalledTimes(2)
  })

  test('should call validateSchedule with each retreivedSchedules when getScheduledSettlements returns 2 schedule records and a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(validateSchedule).toHaveBeenCalledWith(retreivedSchedules[0])
    expect(validateSchedule).toHaveBeenCalledWith(retreivedSchedules[1])
  })

  test('should call updateScheduledSettlementByScheduleId', async () => {
    await batchSchedule(mockStarted)
    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduledSettlementByScheduleId twice when getScheduledSettlements returns 2 valid schedule records and a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledTimes(2)
  })

  test('should call updateScheduledSettlementByScheduleId with each retreivedSchedules.scheduleId, mockStarted and mockTransaction when getScheduledSettlements returns 2 valid schedule records and a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledWith(retreivedSchedules[0].scheduleId, mockStarted, mockTransaction)
    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledWith(retreivedSchedules[1].scheduleId, mockStarted, mockTransaction)
  })

  test('should call mockTransaction.commit when a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should return retreivedSchedules when getScheduledSettlements returns 2 valid schedule records when a started time is given', async () => {
    const result = await batchSchedule(mockStarted)
    expect(result).toStrictEqual(retreivedSchedules)
  })

  test('should not call mockTransaction.rollback when a started time is given', async () => {
    await batchSchedule(mockStarted)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should not throw when getScheduledSettlements throws when a started time is given', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await batchSchedule(mockStarted)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when getScheduledSettlements throws when a started time is given', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule(mockStarted) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getScheduledSettlements throws and a started time is given', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule(mockStarted) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not call validateSchedule when getScheduledSettlements throws and a started time is given', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule(mockStarted) } catch { }
    expect(validateSchedule).not.toHaveBeenCalled()
  })

  test('should not call updateScheduledSettlementByScheduleId when getScheduledSettlements throws and a started time is given', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule(mockStarted) } catch { }
    expect(updateScheduledSettlementByScheduleId).not.toHaveBeenCalled()
  })

  test('should not call mockTransaction.commit when getScheduledSettlements throws and a started time is given', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await batchSchedule(mockStarted) } catch { }
    expect(mockTransaction.commit).not.toHaveBeenCalled()
  })

  test('should not throw when validateSchedule throws and a started time is given', async () => {
    validateSchedule.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      await batchSchedule(mockStarted)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call updateScheduledSettlementByScheduleId when validateSchedule throws and then resolves and a started time is given', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule(mockStarted)

    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduledSettlementByScheduleId once when validateSchedule throws and then resolves and a started time is given', async () => {
    validateSchedule.mockReset()
      .mockImplementationOnce(() => { throw new Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule(mockStarted)

    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduledSettlementByScheduleId with resolved schedule.scheduleId, mockStarted and mockTransaction when validateSchedule throws and then resolves and a started time is given', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule(mockStarted)

    expect(updateScheduledSettlementByScheduleId).toHaveBeenCalledWith(retreivedSchedules[1].scheduleId, mockStarted, mockTransaction)
  })

  test('should call mockTransaction.commit when validateSchedule throws and then resolves and a started time is given', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule(mockStarted)

    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when validateSchedule throws and then resolves and a started time is given', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    await batchSchedule(mockStarted)

    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should return resolved schedule when validateSchedule throws and then resolves and a started time is given', async () => {
    validateSchedule.mockImplementationOnce(() => { throw Error('Joi validation issue') })
      .mockImplementationOnce(() => { return retreivedSchedules[1] })

    const result = await batchSchedule(mockStarted)

    expect(result).toStrictEqual([retreivedSchedules[1]])
  })

  test('should not throw when updateScheduledSettlementByScheduleId throws and a started time is given', async () => {
    updateScheduledSettlementByScheduleId.mockRejectedValue(new Error('Database update issue'))

    const wrapper = async () => {
      await batchSchedule(mockStarted)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.commit when updateScheduledSettlementByScheduleId throws and a started time is given', async () => {
    updateScheduledSettlementByScheduleId.mockRejectedValue(new Error('Database update issue'))
    await batchSchedule(mockStarted)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when updateScheduledSettlementByScheduleId throws and a started time is given', async () => {
    updateScheduledSettlementByScheduleId.mockRejectedValue(new Error('Database update issue'))
    await batchSchedule(mockStarted)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not return the corresponding thrown schedule when updateScheduledSettlementByScheduleId throws then resolves and a started time is given', async () => {
    updateScheduledSettlementByScheduleId.mockReset()
      .mockRejectedValueOnce(new Error('Database update issue'))
      .mockResolvedValueOnce(retreivedSchedules[1])

    const result = await batchSchedule(mockStarted)

    expect(result).not.toStrictEqual([retreivedSchedules[0]])
  })

  test('should return the corresponding resolved schedule when updateScheduledSettlementByScheduleId throws then resolves and a started time is given', async () => {
    updateScheduledSettlementByScheduleId.mockReset()
      .mockRejectedValueOnce(new Error('Database update issue'))
      .mockResolvedValueOnce(retreivedSchedules[1])

    const result = await batchSchedule(mockStarted)

    expect(result).toStrictEqual([retreivedSchedules[1]])
  })

  test('should return an empty array if both schedules passed to updateScheduledSettlementByScheduleId throw and a started time is given', async () => {
    updateScheduledSettlementByScheduleId.mockReset()
      .mockRejectedValueOnce(new Error('Database update issue'))
      .mockRejectedValueOnce(new Error('Database update issue'))

    const result = await batchSchedule(mockStarted)

    expect(result).toStrictEqual([])
  })

  test('should not throw when mockTransaction.commit throws and a started time is given', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await batchSchedule(mockStarted)
    }

    expect(wrapper).not.toThrow()
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws and a started time is given', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await batchSchedule(mockStarted) } catch {}
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws and a started time is given', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await batchSchedule(mockStarted) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})
