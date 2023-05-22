const db = require('../../../../app/data')

const { IMMEDIATE, QUARTERLY } = require('../../../../app/constants/payment-type')

const { getPaymentSchedule } = require('../../../../app/processing/payment-schedule')

let paymentRequestIdInProgress
let paymentRequestIdCompleted

let settlement

let paymentSchedule
let schedule

describe('get payment schedule', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const calculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    const organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))

    const schemes = JSON.parse(JSON.stringify(require('../../../../app/constants/schemes')))
    const {
      SFI_FIRST_PAYMENT: invoiceNumber,
      SFI_SECOND_PAYMENT: invoiceNumberTopUp,
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber,
      SFI_SECOND_PAYMENT_ORIGINAL: originalInvoiceNumberTopUp
    } = JSON.parse(JSON.stringify(require('../../../mock-components/mock-invoice-number')))
    const fundingOptions = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-funding-options')))
    const fundings = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings')))[1]

    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))

    let paymentRequestInProgress = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))
    let paymentRequestInProgressTopUp = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').topUpProcessingPaymentRequest))
    paymentRequestIdInProgress = 3
    paymentRequestInProgress = { ...paymentRequestInProgress, paymentRequestId: 1 }
    paymentRequestInProgressTopUp = { ...paymentRequestInProgressTopUp, paymentRequestId: paymentRequestIdInProgress }

    let paymentRequestCompleted = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    let paymentRequestCompletedTopUp = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').topUpSubmitPaymentRequest))
    paymentRequestIdCompleted = 4
    paymentRequestCompleted = { ...paymentRequestCompleted, completedPaymentRequestId: 1, paymentRequestId: 2 }
    paymentRequestCompletedTopUp = { ...paymentRequestCompletedTopUp, completedPaymentRequestId: paymentRequestIdCompleted, paymentRequestId: 4 }

    const invoiceLineInProgressFirst = paymentRequestInProgress.invoiceLines.map(x => { return { ...x, fundingCode: x.schemeCode, paymentRequestId: paymentRequestIdInProgress } })[0]
    const invoiceLineInProgressSecond = paymentRequestInProgressTopUp.invoiceLines.map(x => { return { ...x, fundingCode: x.schemeCode, paymentRequestId: paymentRequestIdInProgress } })[0]

    const invoiceLineCompletedFirst = paymentRequestCompleted.invoiceLines.map(x => { return { ...x, fundingCode: x.schemeCode, paymentRequestId: paymentRequestIdCompleted } })[0]
    const invoiceLineCompletedSecond = paymentRequestCompletedTopUp.invoiceLines.map(x => { return { ...x, fundingCode: x.schemeCode, paymentRequestId: paymentRequestIdCompleted } })[0]

    await db.scheme.bulkCreate(schemes)
    await db.fundingOption.bulkCreate(fundingOptions)
    await db.invoiceNumber.bulkCreate([{ invoiceNumber, originalInvoiceNumber }, { invoiceNumber: invoiceNumberTopUp, originalInvoiceNumber: originalInvoiceNumberTopUp }])
    await db.paymentRequest.bulkCreate([paymentRequestInProgress, paymentRequestCompleted, paymentRequestInProgressTopUp, paymentRequestCompletedTopUp])
    await db.invoiceLine.bulkCreate([invoiceLineInProgressFirst, invoiceLineInProgressSecond, invoiceLineCompletedFirst, invoiceLineCompletedSecond])
    await db.organisation.create(organisation)
    await db.calculation.bulkCreate([{ ...calculation, paymentRequestId: 1 }, { ...calculation, paymentRequestId: paymentRequestIdInProgress }])
    await db.funding.bulkCreate([{ ...fundings, calculationId: 1 }, { ...fundings, calculationId: 2 }])
    await db.settlement.bulkCreate([{ ...settlement, paymentRequestId: 1 }, { ...settlement, paymentRequestId: paymentRequestIdCompleted }])

    schedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-schedule').SCHEDULE))
    schedule = {
      ...schedule,
      paymentRequestId: paymentRequestIdCompleted,
      scheduleId: 1
    }

    paymentSchedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-schedule')))
  })

  afterEach(async () => {
    jest.clearAllMocks()

    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  test('returns frn key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res)).toContain('frn')
  })

  test('returns frn as number', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.frn).toEqual(expect.any(Number))
  })

  test('returns frn as paymentSchedule.frn', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.frn).toEqual(paymentSchedule.frn)
  })

  test('returns sbi key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res)).toContain('sbi')
  })

  test('returns sbi as number', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.sbi).toEqual(expect.any(Number))
  })

  test('returns sbi as paymentSchedule.sbi', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.sbi).toEqual(paymentSchedule.sbi)
  })

  test('returns schedule key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res)).toContain('schedule')
  })

  test('returns schedule as array', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.schedule).toEqual(expect.any(Array))
  })

  test('returns period key within schedule key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res.schedule[0])).toContain('period')
  })

  test('returns period as string', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.schedule[0].period).toEqual(expect.any(String))
  })

  test('returns value key within schedule key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res.schedule[0])).toContain('value')
  })

  test('returns value as string', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.schedule[0].value).toEqual(expect.any(String))
  })

  test('returns order key within schedule key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res.schedule[0])).toContain('order')
  })

  test('returns order as number', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.schedule[0].order).toEqual(expect.any(Number))
  })

  test('returns order as incremental values', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)

    const numbers = [...Array(res.schedule.length).keys()]
    res.schedule.map((x, i) => expect(x.order).toEqual(numbers[i] + 1))
  })

  test('returns dueDate key within schedule key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res.schedule[0])).toContain('dueDate')
  })

  test('returns dueDate as string', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.schedule[0].dueDate).toEqual(expect.any(String))
  })

  test('returns paymentType key within schedule key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res.schedule[0])).toContain('paymentType')
  })

  test('returns paymentType as string', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.schedule[0].paymentType).toEqual(expect.any(String))
  })

  test('returns paymentType as QUARTERLY, IMMEDIATE or undefined', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    res.schedule.map(x => expect(x.paymentType === QUARTERLY || x.paymentType === IMMEDIATE || x.paymentType === undefined).toBe(true))
  })

  test('returns period key within schedule key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res.schedule[0])).toContain('period')
  })

  test('returns period as string', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.schedule[0].period).toEqual(expect.any(String))
  })

  test('returns period as paymentSchedule.schedule.period', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.schedule[0].period).toEqual(paymentSchedule.schedule[0].period)
  })

  test('returns scheme key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res)).toContain('scheme')
  })

  test('returns scheme as object', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.scheme).toEqual(expect.any(Object))
  })

  test('returns year key within scheme key', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(Object.keys(res.scheme)).toContain('year')
  })

  test('returns year as string', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.scheme.year).toEqual(expect.any(String))
  })

  test('returns year as paymentSchedule.scheme.year', async () => {
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    expect(res.scheme.year).toEqual(paymentSchedule.scheme.year)
  })

  test('returns paymentSchedule', async () => {
    paymentSchedule.schedule.forEach(x => { if (x.paymentType === IMMEDIATE) { x.dueDate = undefined } })
    const res = await getPaymentSchedule(schedule.paymentRequestId, schedule.scheduleId)
    console.log(res)
    expect(res).toStrictEqual(paymentSchedule)
  })
})
