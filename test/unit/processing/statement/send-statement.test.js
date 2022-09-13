jest.mock('../../../../app/processing/statement/update-schedule-by-schedule-id')
const updateScheduleByScheduleId = require('../../../../app/processing/statement/update-schedule-by-schedule-id')

jest.mock('../../../../app/processing/statement/publish-statement')
const publishStatement = require('../../../../app/processing/statement/publish-statement')

const sendStatement = require('../../../../app/processing/statement/send-statement')

const scheduleId = 1
const mockStatement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))
const transaction = {} // mock this as in previous tests

describe('send statement', () => {
  beforeEach(() => {
    updateScheduleByScheduleId.mockResolvedValue(undefined)
    publishStatement.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call updateScheduleByScheduleId', async () => {
    await sendStatement(scheduleId, mockStatement, transaction)
    expect(updateScheduleByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduleByScheduleId once', async () => {
    await sendStatement(scheduleId, mockStatement, transaction)
    expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduleByScheduleId with scheduleId and transaction', async () => {
    await sendStatement(scheduleId, mockStatement, transaction)
    expect(updateScheduleByScheduleId).toHaveBeenCalledWith(scheduleId, transaction)
  })

  test('should call publishStatement', async () => {
    await sendStatement(scheduleId, mockStatement, transaction)
    expect(publishStatement).toHaveBeenCalled()
  })

  test('should call publishStatement once', async () => {
    await sendStatement(scheduleId, mockStatement, transaction)
    expect(publishStatement).toHaveBeenCalledTimes(1)
  })

  test('should call publishStatement with mockStatement', async () => {
    await sendStatement(scheduleId, mockStatement, transaction)
    expect(publishStatement).toHaveBeenCalledWith(mockStatement)
  })

  test('should throw when publishStatement rejects ', async () => {
    publishStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, mockStatement, transaction)
    }
    await expect(wrapper).rejects.toThrow()
  })

  test('should throw error when publishStatement rejects ', async () => {
    publishStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, mockStatement, transaction)
    }
    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with message "Failed to send statement with scheduleId of {scheduleId}" when publishStatement rejects ', async () => {
    publishStatement.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, mockStatement, transaction)
    }
    await expect(wrapper).rejects.toThrow(new Error(`Failed to send statement with scheduleId of ${scheduleId}`))
  })

  test('should throw when updateScheduleByScheduleId rejects ', async () => {
    updateScheduleByScheduleId.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, mockStatement, transaction)
    }
    await expect(wrapper).rejects.toThrow()
  })

  test('should throw error when updateScheduleByScheduleId rejects ', async () => {
    updateScheduleByScheduleId.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, mockStatement, transaction)
    }
    await expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with message "Failed to send statement with scheduleId of {scheduleId}" when updateScheduleByScheduleId rejects ', async () => {
    updateScheduleByScheduleId.mockRejectedValue(Error)
    const wrapper = async () => {
      await sendStatement(scheduleId, mockStatement, transaction)
    }
    await expect(wrapper).rejects.toThrow(new Error(`Failed to send statement with scheduleId of ${scheduleId}`))
  })
})
