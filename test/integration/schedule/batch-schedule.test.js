const moment = require('moment')

const db = require('../../../app/data')
const config = require('../../../app/config').processingConfig

const schemes = require('../../../app/constants/schemes')

const batchSchedule = require('../../../app/processing/schedule')

jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))

const LESS_TIME_THAN_ELASPED_MAX = moment(new Date()).subtract(config.scheduleProcessingMaxElaspedTime - 500).toDate()
const MORE_TIME_THAN_ELASPED_MAX = moment(new Date()).subtract(config.scheduleProcessingMaxElaspedTime + 500).toDate()

let schedule

describe('batch schedule', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const paymentRequest = JSON.parse(JSON.stringify(require('../../mock-payment-request').submitPaymentRequest))
    const settlement = JSON.parse(JSON.stringify(require('../../mock-settlement')))
    schedule = JSON.parse(JSON.stringify(require('../../mock-schedule')))

    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({
      invoiceNumber: paymentRequest.invoiceNumber,
      originalInvoiceNumber: paymentRequest.invoiceNumber.slice(0, 5)
    })
    await db.paymentRequest.create(paymentRequest)
    await db.settlement.create({ ...settlement, paymentRequestId: 1 })
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

  test('should return mapped schedule array when existing valid schedule with null completed and null started exists', async () => {
    await db.schedule.create(schedule)

    const result = await batchSchedule()

    expect(result).toStrictEqual([{
      scheduleId: 1,
      settlementId: schedule.settlementId
    }])
  })

  test('should return empty array when no existing schedule exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const result = await batchSchedule()

    expect(result).toStrictEqual([])
  })

  test('should return mapped schedule array when existing schedule with null completed and started is MORE_TIME_THAN_ELASPED_MAX exists', async () => {
    schedule.started = MORE_TIME_THAN_ELASPED_MAX
    await db.schedule.create(schedule)

    const result = await batchSchedule()

    expect(result).toStrictEqual([{
      scheduleId: 1,
      settlementId: schedule.settlementId
    }])
  })

  test('should return empty array when existing schedule with null completed and started is LESS_TIME_THAN_ELASPED_MAX exists', async () => {
    schedule.started = LESS_TIME_THAN_ELASPED_MAX
    await db.schedule.create(schedule)

    const result = await batchSchedule()

    expect(result).toStrictEqual([])
  })

  test('should return empty array when existing schedule with not null completed and null started exists', async () => {
    schedule.completed = new Date()
    await db.schedule.create(schedule)

    const result = await batchSchedule()

    expect(result).toStrictEqual([])
  })

  test('should return empty array when existing schedule with not null completed and started is MORE_TIME_THAN_ELASPED_MAX exists', async () => {
    schedule.started = MORE_TIME_THAN_ELASPED_MAX
    schedule.completed = new Date()
    await db.schedule.create(schedule)

    const result = await batchSchedule()

    expect(result).toStrictEqual([])
  })

  test('should return empty array when existing schedule with not null completed and started is LESS_TIME_THAN_ELASPED_MAX exists', async () => {
    schedule.started = LESS_TIME_THAN_ELASPED_MAX
    schedule.completed = new Date()
    await db.schedule.create(schedule)

    const result = await batchSchedule()

    expect(result).toStrictEqual([])
  })
})
