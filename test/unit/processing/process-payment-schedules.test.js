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
const { schedulePendingSettlements, schedulePendingPaymentSchedules } = require('../../../app/processing/schedule')

jest.mock('../../../app/processing/statement')
const { getStatement, sendStatement, validateStatement } = require('../../../app/processing/statement')

jest.mock('../../../app/processing/payment-schedule')
const { getPaymentSchedule, sendPaymentSchedule, validatePaymentSchedule } = require('../../../app/processing/payment-schedule')

jest.mock('../../../app/processing/update-schedule-by-schedule-id')
const updateScheduleByScheduleId = require('../../../app/processing/update-schedule-by-schedule-id')

const processPaymentSchedules = require('../../../app/processing/process-payment-schedules')

let retrievedSchedule
let statement

let retrievedPaymentSchedule

describe('process statements', () => {
  beforeEach(() => {
    const schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').STATEMENT))
    retrievedSchedule = {
      scheduleId: 1,
      settlementId: schedule.settlementId
    }
    const paymentSchedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').SCHEDULE))
    retrievedPaymentSchedule = {
      scheduleId: 1,
      paymentRequestId: paymentSchedule.paymentRequestId
    }

    statement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-statement')))

    schedulePendingSettlements.mockResolvedValue([retrievedSchedule])
    getStatement.mockResolvedValue(statement)
    validateStatement.mockReturnValue(true)
    sendStatement.mockResolvedValue(undefined)

    schedulePendingPaymentSchedules.mockResolvedValue([retrievedPaymentSchedule])
    getPaymentSchedule.mockResolvedValue(paymentSchedule)
    validatePaymentSchedule.mockReturnValue(true)
    sendPaymentSchedule.mockResolvedValue(undefined)

    updateScheduleByScheduleId.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call schedulePendingSettlements', async () => {
    await processPaymentSchedules()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalled()
  })

  test('should call schedulePendingPaymentSchedules', async () => {
    await processStatements()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalled()
  })

  test('should call schedulePendingPaymentSchedules once if schedule construction active', async () => {
    await processStatements()
    expect(schedulePendingPaymentSchedules).toHaveBeenCalledTimes(1)
  })

  test('should not call schedulePendingPaymentSchedules if schedule construction not active', async () => {
    await processStatements()
    expect(schedulePendingPaymentSchedules).not.toHaveBeenCalled()
  })

  test('should call getPaymentSchedule when schedulePendingSchedules returns 1 record', async () => {
    await processStatements()
    expect(getPaymentSchedule).toHaveBeenCalled()
  })

  test('should call getPaymentSchedule once when schedulePendingSchedules returns 1 record', async () => {
    await processStatements()
    expect(getPaymentSchedule).toHaveBeenCalledTimes(1)
  })

  test('should call getPaymentSchedule with schedulePendingSchedules()[0].paymentScheduleId and mockTransaction when schedulePendingSchedules returns 1 record', async () => {
    await processStatements()
    expect(getPaymentSchedule).toHaveBeenCalledWith((await schedulePendingPaymentSchedules())[0].paymentRequestId)
  })

  test('should not call getPaymentSchedule when schedulePendingSchedules returns an empty array', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([])
    await processStatements()
    expect(getPaymentSchedule).not.toHaveBeenCalled()
  })

  test('should call getPaymentSchedule when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processStatements()
    expect(getPaymentSchedule).toHaveBeenCalled()
  })

  test('should call getPaymentSchedule twice when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processStatements()
    expect(getPaymentSchedule).toHaveBeenCalledTimes(2)
  })

  test('should call getPaymentSchedule with each schedulePendingSchedules().paymentScheduleId and mockTransaction when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])

    await processStatements()

    expect(getPaymentSchedule).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].paymentRequestId)
    expect(getPaymentSchedule).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[1].paymentRequestId)
  })

  test('should call getPaymentSchedule when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processStatements()
    expect(getPaymentSchedule).toHaveBeenCalled()
  })

  test('should call getPaymentSchedule twice when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processStatements()
    expect(getPaymentSchedule).toHaveBeenCalledTimes(2)
  })

  test('should call getPaymentSchedule with each schedulePendingSchedules().paymentScheduleId and mockTransaction when schedulePendingSchedules returns 2 records', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([retrievedSchedule, retrievedSchedule])
    await processStatements()
    expect(getPaymentSchedule).toHaveBeenNthCalledWith(1, (await schedulePendingPaymentSchedules())[0].paymentScheduleId)
    expect(getPaymentSchedule).toHaveBeenNthCalledWith(2, (await schedulePendingPaymentSchedules())[1].paymentScheduleId)
  })

  test('should not call getPaymentSchedule when schedulePendingSchedules returns an empty array', async () => {
    schedulePendingPaymentSchedules.mockResolvedValue([])
    await processStatements()
    expect(getPaymentSchedule).not.toHaveBeenCalled()
  })

  test('should call sendPaymentSchedule when schedulePendingPaymentSchedules returns 1 record', async () => {
    await processStatements()
    expect(sendPaymentSchedule).toHaveBeenCalled()
  })

  test('should call sendPaymentSchedule once when schedulePendingPaymentSchedules returns 1 record', async () => {
    await processStatements()
    expect(sendPaymentSchedule).toHaveBeenCalledTimes(1)
  })

  test('should call sendPaymentSchedule with schedulePendingPaymentSchedules()[0].paymentScheduleId and getPaymentSchedule when schedulePendingPaymentSchedules returns 1 record', async () => {
    await processStatements()
    expect(sendPaymentSchedule).toHaveBeenCalledWith(await getPaymentSchedule())
  })

  test('should call updateScheduleByScheduleId when schedulePendingSettlements returns 1 record', async () => {
    await processStatements()
    expect(updateScheduleByScheduleId).toHaveBeenCalled()
  })

  test('should call updateScheduleByScheduleId twice when schedulePendingSettlements and schedulePendingPaymentSchedules both return 1 record', async () => {
    await processStatements()
    expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(2)
  })

  test('should call updateScheduleByScheduleId once when schedulePendingSettlements and schedulePendingPaymentSchedules both return 1 record and schedule construction not active', async () => {
    await processStatements()
    expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduleByScheduleId once when schedulePendingSettlements and schedulePendingPaymentSchedules both return 1 record and construction not active', async () => {
    await processStatements()
    expect(updateScheduleByScheduleId).toHaveBeenCalledTimes(1)
  })

  test('should call updateScheduleByScheduleId with schedulePendingSettlements()[0].scheduleId and mockTransaction when schedulePendingSettlements returns 1 record', async () => {
    await processStatements()
    expect(updateScheduleByScheduleId).toHaveBeenCalledWith((await schedulePendingSettlements())[0].scheduleId)
  })

  test('should not throw when schedulePendingSettlements throws', async () => {
    schedulePendingSettlements.mockRejectedValue(new Error('Processing issue'))

    const wrapper = async () => {
      await processStatements()
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when schedulePendingSettlements returns an empty array', async () => {
    schedulePendingSettlements.mockResolvedValue([])

    const wrapper = async () => {
      await processStatements()
    }

    expect(wrapper).not.toThrow()
  })
})
