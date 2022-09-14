jest.mock('../../../../app/processing/statement/update-schedule-by-schedule-id')
const updateScheduleByScheduleId = require('../../../../app/processing/statement/update-schedule-by-schedule-id')

jest.mock('../../../../app/processing/statement/publish-statement')
const publishStatement = require('../../../../app/processing/statement/publish-statement')

const sendStatement = require('../../../../app/processing/statement/send-statement')

const scheduleId = 1
const statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn()
}

describe('send statement', () => {
  beforeEach(() => {
    updateScheduleByScheduleId.mockResolvedValue(undefined)
    publishStatement.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call updateScheduleByScheduleId', async () => {
    await sendStatement(scheduleId, statement, mockTransaction)
    expect(updateScheduleByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduleByScheduleId once', async () => {
    await sendStatement(scheduleId, statement, mockTransaction)
    expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduleByScheduleId with scheduleId and mockTransaction', async () => {
    await sendStatement(scheduleId, statement, mockTransaction)
    expect(updateScheduleByScheduleId).toHaveBeenCalledWith(scheduleId, mockTransaction)
  })

  test('should call publishStatement', async () => {
    await sendStatement(scheduleId, statement, mockTransaction)
    expect(publishStatement).toHaveBeenCalled()
  })

  test('should call publishStatement once', async () => {
    await sendStatement(scheduleId, statement, mockTransaction)
    expect(publishStatement).toHaveBeenCalledTimes(1)
  })

  test('should call publishStatement with statement', async () => {
    await sendStatement(scheduleId, statement, mockTransaction)
    expect(publishStatement).toHaveBeenCalledWith(statement)
  })

  test('should throw when publishStatement rejects ', async () => {
    publishStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, statement, mockTransaction)
    }
    await expect(wrapper).rejects.toThrow()
  })

  test('should throw error when publishStatement rejects ', async () => {
    publishStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, statement, mockTransaction)
    }
    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with message "Failed to send statement with scheduleId of {scheduleId}" when publishStatement rejects ', async () => {
    publishStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, statement, mockTransaction)
    }
    await expect(wrapper).rejects.toThrow(new Error(`Failed to send statement with scheduleId of ${scheduleId}`))
  })

  test('should throw when updateScheduleByScheduleId rejects ', async () => {
    updateScheduleByScheduleId.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, statement, mockTransaction)
    }
    await expect(wrapper).rejects.toThrow()
  })

  test('should throw error when updateScheduleByScheduleId rejects ', async () => {
    updateScheduleByScheduleId.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, statement, mockTransaction)
    }
    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with message "Failed to send statement with scheduleId of {scheduleId}" when updateScheduleByScheduleId rejects ', async () => {
    updateScheduleByScheduleId.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, statement, mockTransaction)
    }
    await expect(wrapper).rejects.toThrow(new Error(`Failed to send statement with scheduleId of ${scheduleId}`))
  })
})
