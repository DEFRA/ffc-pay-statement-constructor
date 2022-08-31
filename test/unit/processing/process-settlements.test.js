
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
const processSettlements = require('../../../app/processing/process-settlements')

let mockStarted
let retreivedSchedules

describe('process settlements', () => {
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

    retreivedSchedules = [retreivedSchedule]

    getScheduledSettlements.mockResolvedValue(retreivedSchedules)
    schema.validate.mockReturnValue({ value: retreivedSchedule })
    updateScheduledSettlementsByScheduleId.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getScheduledSettlements', async () => {
    await processSettlements()
    expect(getScheduledSettlements).toHaveBeenCalled()
  })

  test('should call getScheduledSettlements once', async () => {
    await processSettlements()
    expect(getScheduledSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements with new Date() and mockTransaction', async () => {
    await processSettlements()
    expect(getScheduledSettlements).toHaveBeenCalledWith(new Date(), mockTransaction)
  })

  test('should call updateScheduledSettlementsByScheduleId', async () => {
    await processSettlements()
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduledSettlementsByScheduleId once', async () => {
    await processSettlements()
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduledSettlementsByScheduleId with each retreivedSchedules.scheduleId, new Date() and mockTransaction', async () => {
    await processSettlements()
    expect(updateScheduledSettlementsByScheduleId).toHaveBeenCalledWith([retreivedSchedules[0].scheduleId], new Date(), mockTransaction)
  })

  test('should call mockTransaction.commit', async () => {
    await processSettlements()
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once', async () => {
    await processSettlements()
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should throw when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processSettlements()
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getScheduledSettlements throws Error', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processSettlements()
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getScheduledSettlements throws error with "Database retrieval issue"', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processSettlements()
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should call mockTransaction.rollback when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getScheduledSettlements throws', async () => {
    getScheduledSettlements.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should throw when updateScheduledSettlementsByScheduleId throws', async () => {
    updateScheduledSettlementsByScheduleId.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSettlements()
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when updateScheduledSettlementsByScheduleId throws Error', async () => {
    updateScheduledSettlementsByScheduleId.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSettlements()
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when updateScheduledSettlementsByScheduleId throws error with "Database save down issue"', async () => {
    updateScheduledSettlementsByScheduleId.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processSettlements()
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should call mockTransaction.rollback when updateScheduledSettlementsByScheduleId throws', async () => {
    updateScheduledSettlementsByScheduleId.mockRejectedValue(new Error('Database save down issue'))
    try { await processSettlements() } catch {}
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when updateScheduledSettlementsByScheduleId throws', async () => {
    updateScheduledSettlementsByScheduleId.mockRejectedValue(new Error('Database save down issue'))
    try { await processSettlements() } catch {}
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processSettlements()
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mockTransaction.commit throws Error', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processSettlements()
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Sequelize transaction commit issue" when mockTransaction.commit throws error with "Sequelize transaction commit issue"', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processSettlements()
    }

    expect(wrapper).rejects.toThrow(/^Sequelize transaction commit issue$/)
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processSettlements() } catch {}
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processSettlements() } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements when a started time is given', async () => {
    console.error(mockStarted)
    await processSettlements(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalled()
  })

  test('should call getScheduledSettlements once when a started time is given', async () => {
    console.error(mockStarted)
    await processSettlements(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalledTimes(1)
  })

  test('should call getScheduledSettlements with mockStarted and mockTransaction when a started time is given', async () => {
    console.error(mockStarted)
    await processSettlements(mockStarted)
    expect(getScheduledSettlements).toHaveBeenCalledWith(mockStarted, mockTransaction)
  })
})
