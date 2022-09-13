// called, called once, called with
jest.mock('../../../../app/processing/statement/update-schedule-by-schedule-id')
const updateScheduleByScheduleId = require('../../../../app/processing/statement/update-schedule-by-schedule-id')

const sendStatement = require('../../../../app/processing/statement/send-statement')

const scheduleId = 1
const mockStatement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))
const transaction = {} // do we need to mock this?

describe('send statement', () => {
  beforeEach(() => {

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
})
