const db = require('../../../../app/data')

const { getStatement } = require('../../../../app/processing/statement')

let paymentRequestIdInProgress
let paymentRequestIdCompleted

let settlement

let schedule
let statement

const reverseEngineerInvoiceNumber = require('../../../../app/utility/reverse-engineer-invoice-number')

describe('get statement', () => {
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
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../../mock-components/mock-invoice-number')))
    const fundingOptions = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-funding-options')))
    const fundings = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings')))[1]

    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))

    let paymentRequestInProgress = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))
    paymentRequestIdInProgress = 1
    paymentRequestInProgress = { ...paymentRequestInProgress, paymentRequestId: paymentRequestIdInProgress }

    let paymentRequestCompleted = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    paymentRequestIdCompleted = 2
    paymentRequestCompleted = { ...paymentRequestCompleted, paymentRequestId: paymentRequestIdCompleted }

    const invoiceLineInProgress = paymentRequestInProgress.invoiceLines.map(x => { return { ...x, fundingCode: x.schemeCode, paymentRequestId: paymentRequestIdInProgress } })[0]
    const invoiceLineCompleted = paymentRequestCompleted.invoiceLines.map(x => { return { ...x, fundingCode: x.schemeCode, paymentRequestId: paymentRequestIdCompleted } })[0]

    await db.scheme.bulkCreate(schemes)
    await db.fundingOption.bulkCreate(fundingOptions)
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.bulkCreate([paymentRequestInProgress, paymentRequestCompleted])
    await db.invoiceLine.bulkCreate([invoiceLineInProgress, invoiceLineCompleted])
    await db.organisation.create(organisation)
    await db.calculation.create({ ...calculation, paymentRequestId: paymentRequestIdInProgress })
    await db.funding.create({ ...fundings, calculationId: 1 })
    await db.settlement.create({ ...settlement, paymentRequestId: paymentRequestIdCompleted })

    schedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-schedule').STATEMENT))
    schedule = {
      ...schedule,
      scheduleId: 1
    }

    statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))
  })

  afterEach(async () => {
    jest.clearAllMocks()

    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  describe('when all information is present', () => {
    test('returns frn key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res)).toContain('frn')
    })

    test('returns frn as number', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.frn).toEqual(expect.any(Number))
    })

    test('returns frn as statement.frn', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.frn).toEqual(statement.frn)
    })

    test('returns sbi key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res)).toContain('sbi')
    })

    test('returns sbi as number', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.sbi).toEqual(expect.any(Number))
    })

    test('returns sbi as statement.sbi', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.sbi).toEqual(statement.sbi)
    })

    test('returns funding key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res)).toContain('funding')
    })

    test('returns funding as array', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding).toEqual(expect.any(Array))
    })

    test('returns annualValue key within funding key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res.funding[0])).toContain('annualValue')
    })

    test('returns annualValue as string', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].annualValue).toEqual(expect.any(String))
    })

    test('returns annualValue as statement.funding.annualValue', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].annualValue).toEqual(statement.funding[0].annualValue)
    })

    test('returns area key within funding key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res.funding[0])).toContain('area')
    })

    test('returns area as string', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].area).toEqual(expect.any(String))
    })

    test('returns area as statement.funding.area', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].area).toEqual(statement.funding[0].area)
    })

    test('returns quarterlyPayment key within funding key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res.funding[0])).toContain('quarterlyPayment')
    })

    test('returns quarterlyPayment as string', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].quarterlyPayment).toEqual(expect.any(String))
    })

    test('returns quarterlyPayment as statement.funding.quarterlyPayment', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].quarterlyPayment).toEqual(statement.funding[0].quarterlyPayment)
    })

    test('returns quarterlyReduction key within funding key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res.funding[0])).toContain('quarterlyReduction')
    })

    test('returns quarterlyReduction as string', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].quarterlyReduction).toEqual(expect.any(String))
    })

    test('returns quarterlyReduction as statement.funding.quarterlyReduction', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].quarterlyReduction).toEqual(statement.funding[0].quarterlyReduction)
    })

    test('returns quarterlyValue key within funding key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res.funding[0])).toContain('quarterlyValue')
    })

    test('returns quarterlyValue as string', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].quarterlyValue).toEqual(expect.any(String))
    })

    test('returns quarterlyValue as statement.funding.quarterlyValue', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].quarterlyValue).toEqual(statement.funding[0].quarterlyValue)
    })

    test('returns rate key within funding key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res.funding[0])).toContain('rate')
    })

    test('returns rate as string', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].rate).toEqual(expect.any(String))
    })

    test('returns rate as statement.funding.rate', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.funding[0].rate).toEqual(statement.funding[0].rate)
    })

    test('returns payments key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res)).toContain('payments')
    })

    test('returns payments as array', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.payments).toEqual(expect.any(Array))
    })

    test('returns value key within payments key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res.payments[0])).toContain('value')
    })

    test('returns value as string', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.payments[0].value).toEqual(expect.any(String))
    })

    test('returns value as statement.payments.value', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.payments[0].value).toEqual(statement.payments[0].value)
    })

    test('returns scheme key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res)).toContain('scheme')
    })

    test('returns scheme as object', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.scheme).toEqual(expect.any(Object))
    })

    test('returns year key within scheme key', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(res.scheme)).toContain('year')
    })

    test('returns year as string', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.scheme.year).toEqual(expect.any(String))
    })

    test('returns year as statement.scheme.year', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res.scheme.year).toEqual(statement.scheme.year)
    })

    test('returns statement', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res).toStrictEqual(statement)
    })
  })

  describe('when settlement is not connected to a payment request', () => {
    beforeEach(async () => {
      await db.settlement.update({ paymentRequestId: null }, { where: { paymentRequestId: paymentRequestIdCompleted } })
    })

    test('should update paymentRequestId', async () => {
      const settlementBefore = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })

      await getStatement(schedule.settlementId, schedule.scheduleId)

      const settlementAfter = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
      expect(settlementBefore.paymentRequestId).toBeNull()
      expect(settlementAfter.paymentRequestId).not.toBeNull()
    })

    test('should update paymentRequestId to paymentRequestIdCompleted', async () => {
      await getStatement(schedule.settlementId, schedule.scheduleId)

      const settlementAfter = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
      expect(settlementAfter.paymentRequestId).toBe(paymentRequestIdCompleted)
    })

    test('returns statement', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res).toStrictEqual(statement)
    })
  })

  describe('when calculation is not connected to a payment request', () => {
    beforeEach(async () => {
      await db.calculation.update({ paymentRequestId: null }, { where: { paymentRequestId: paymentRequestIdInProgress } })
    })

    test('should update paymentRequestId', async () => {
      const calculationBefore = await db.calculation.findOne({ where: { invoiceNumber: reverseEngineerInvoiceNumber(settlement.invoiceNumber) } })

      await getStatement(schedule.settlementId, schedule.scheduleId)

      const calculationAfter = await db.calculation.findOne({ where: { invoiceNumber: reverseEngineerInvoiceNumber(settlement.invoiceNumber) } })
      expect(calculationBefore.paymentRequestId).toBeNull()
      expect(calculationAfter.paymentRequestId).not.toBeNull()
    })

    test('should update paymentRequestId to paymentRequestIdInProgress', async () => {
      await getStatement(schedule.settlementId, schedule.scheduleId)

      const calculationAfter = await db.calculation.findOne({ where: { invoiceNumber: reverseEngineerInvoiceNumber(settlement.invoiceNumber) } })
      expect(calculationAfter.paymentRequestId).toBe(paymentRequestIdInProgress)
    })

    test('returns statement', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res).toStrictEqual(statement)
    })
  })
})
