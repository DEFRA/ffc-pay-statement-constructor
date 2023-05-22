const db = require('../../../../app/data')

// jest mock timers
/// jest system time now

jest.mock('../../../../app/processing/settlement/get-settlement')
const getStatement = require('../../../../app/processing/statement/get-statement')

const processStatements = require('../../../../app/processing/process-statements')

let statement

describe('process statements', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))

    getStatement.mockResolvedValue(statement)
  })

  afterEach(async () => {
    jest.clearAllMocks()

    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  describe('when schedulePendingSettlements returns record', () => {
    beforeEach(async () => {
    })

    describe('when valid statement', () => {
      test('should update started for schedule', async () => {
        const scheduleBefore = await db.schedule.findAll({ raw: true })[0]

        await processStatements()

        const scheduleAfter = await db.schedule.findAll({ raw: true })[0]
        expect(scheduleBefore.started).toBeNull()
        expect(scheduleAfter.started).toBeDefined()
      })

      test('should update started to date now', async () => {
        await processStatements()

        const schedule = await db.schedule.findAll({ raw: true })[0]
        expect(schedule.started).toBe(new Date())
      })

      test('should call ffc-messaging sendMessage', async () => {
        await processStatements()
        expect(1).toHaveBeenCalled()
      })

      test('should call ffc-messaging sendMessage once', async () => {
        await processStatements()
        expect(1).toHaveBeenCalledTimes(1)
      })

      test('should call ffc-messaging sendMessage with message', async () => {
        await processStatements()
        expect(1).toHaveBeenCalledWith({ body: { a: 1 } })
      })

      test('should update schedule completed field', async () => {
        const scheduleBefore = await db.schedule.findAll({ raw: true })[0]

        await processStatements()

        const scheduleAfter = await db.schedule.findAll({ raw: true })[0]
        expect(scheduleBefore.completed).toBeNull()
        expect(scheduleAfter.completed).toBeDefined()
      })

      test('should update schedule completed field to date now', async () => {
        await processStatements()

        const schedule = await db.schedule.findAll({ raw: true })[0]
        expect(schedule.completed).toBe(new Date())
      })
    })

    describe('when invalid statement', () => {
      // invalidate
      test('should not call ffc-messaging sendMessage', async () => {
        await processStatements()
        expect(1).not.toHaveBeenCalled()
      })

      test('should update schedule completed field', async () => {
        const scheduleBefore = await db.schedule.findAll({ raw: true })[0]

        await processStatements()

        const scheduleAfter = await db.schedule.findAll({ raw: true })[0]
        expect(scheduleBefore.completed).toBeNull()
        expect(scheduleAfter.completed).toBeDefined()
      })

      test('should update schedule completed field to date now', async () => {
        await processStatements()

        const schedule = await db.schedule.findAll({ raw: true })[0]
        expect(schedule.completed).toBe(new Date())
      })
    })
  })
})

//   describe('for batch max size', () => {

//   })

//   describe('over settlementwaittime', () => {

//   })

//   describe('over scheduleProcessingMaxElapsedTime', () => {

//   })
// })

test('a', () => {
  expect(1).toBe(1)
})
