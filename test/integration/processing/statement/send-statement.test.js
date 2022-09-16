const db = require('../../../../app/data')

const { sendStatement } = require('../../../../app/processing/statement')

jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: jest.fn(),
        closeConnection: jest.fn()
      }
    })
  }
})

const { DATE: COMPLETED_DATE } = require('../../../mock-components/mock-dates').SCHEDULED

const statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))
const mockSettlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
const mockSchedule = JSON.parse(JSON.stringify(require('../../../mock-schedule')))

let scheduleId

describe('send statement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(COMPLETED_DATE)
    await db.settlement.create(mockSettlement)
    await db.schedule.create(mockSchedule)
    scheduleId = 1
  })

  afterEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('schedule.completed should be null before sendStatement is called and should not be null after sendStatement is called', async () => {
    const foundSchedule = await db.schedule.findOne({ where: { scheduleId } })

    await sendStatement(scheduleId, statement)

    const updatedSchedule = await db.schedule.findOne({ where: { scheduleId } })
    expect(foundSchedule.completed).toBeNull()
    expect(updatedSchedule.completed).not.toBeNull()
  })

  test('schedule.completed should be equal to new date after sendStatement called', async () => {
    await sendStatement(scheduleId, statement)

    const updatedSchedule = await db.schedule.findOne({ where: { scheduleId } })
    expect(updatedSchedule.completed).toStrictEqual(COMPLETED_DATE)
  })

  test('should not throw if the scheduleId is not present', async () => {
    scheduleId = 12
    const wrapper = async () => {
      await sendStatement(scheduleId, statement)
    }
    expect(wrapper).not.toThrow()
  })
})
