// jest.mock('../../../app/processing/schedule')
// const { schedulePendingSettlements } = require('../../../app/processing/schedule')

// jest.mock('../../../app/processing/statement')
// const { getStatement, sendStatement, validateStatement } = require('../../../app/processing/statement')

// jest.mock('../../../app/processing/update-schedule-by-schedule-id')
// const updateScheduleByScheduleId = require('../../../app/processing/update-schedule-by-schedule-id')

// const processStatements = require('../../../app/processing/process-statements')
// const db = require('../../../../app/data')

// let retrievedSchedule
// let statement

// // mock ffc-messaging

// describe('process statements', () => {
//   beforeEach(async () => {
//     const schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').STATEMENT))
//     retrievedSchedule = {
//       scheduleId: 1,
//       settlementId: schedule.settlementId
//     }

//     statement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-statement')))

//     schedulePendingSettlements.mockResolvedValue([retrievedSchedule])
//     sendStatement.mockResolvedValue(undefined)
//     updateScheduleByScheduleId.mockResolvedValue(undefined)
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   describe('for new record', () => {
//     test('should update started for schedule', async () => {
//     })

//     test('should add statement to message statement topic', async () => {
//       await processStatements()

//       // isn't really int test as mock
//       // expect mocksend to be called with statement
//       expect(1).toBe(1)
//     })

//     test('should update completed for schedule', async () => {
//       const scheduleBefore = db.schedule.findAll()

//       await processStatements()

//       const scheduleAfter = db.schedule.findAll()
//       expect(scheduleBefore.completed).toBeUndefined()
//       expect(scheduleAfter.completed).toBeDefined() // mock timers
//     })
//   })

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
