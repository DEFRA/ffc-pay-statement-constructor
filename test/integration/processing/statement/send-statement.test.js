const db = require('../../../../app/data')

const sendStatement = require('../../../../app/processing/statement')

const mockSendMessages = jest.fn()

jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessages,
        closeConnection: jest.fn()
      }
    })
  }
})

const statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))
const mockSettlement = JSON.parse(JSON.stringify(require('../../../mock-settlement')))
const mockSchedule = JSON.parse(JSON.stringify(require('../../../mock-schedule')))
const scheduleId = 1

describe('send statement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    try {
      jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))
      await db.settlement.create(mockSettlement)
      await db.schedule.create(mockSchedule)
    } catch (err) {
      console.error(err)
    }
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
    expect(updatedSchedule.completed).toStrictEqual(new Date(2022, 7, 5, 12, 0, 0, 0))
  })
})
