const db = require('../../../../app/data')

const { getStatement } = require('../../../../app/processing/statement')

let schedule
let paymentRequestId
let statement

describe('get statement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))

    schedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-schedule').STATEMENT))
    schedule = {
      ...schedule,
      scheduleId: 1
    }

    const calculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    const organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))

    const schemes = JSON.parse(JSON.stringify(require('../../../../app/constants/schemes')))
    const {
      SFI_FIRST_PAYMENT: invoiceNumber,
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../../mock-components/mock-invoice-number')))
    const fundingOptions = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-funding-options')))
    const fundings = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings')))[1]

    const settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))

    let paymentRequestInProgress = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))
    const paymentRequestIdInProgress = 1
    paymentRequestInProgress = { ...paymentRequestInProgress, paymentRequestId: paymentRequestIdInProgress }

    let paymentRequestCompleted = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    const paymentRequestIdCompleted = 2
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
  })

  afterEach(async () => {
    jest.clearAllMocks()

    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  describe('when all info', () => {
    test('return what I want', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res).toStrictEqual(statement)
    })
  })

  describe('when missing settlement to payment request', () => {
    beforeEach(async () => {
      await db.settlement.update({ paymentRequestId: null }, { where: { paymentRequestId } })
    })

    // app/processing/settlement/update-settlement-payment-request-id.js
    test('should update paymentRequestId for settlement by invoice number', async () => {
      const settlementBefore = db.settlement.findAll()

      await getStatement(schedule.settlementId, schedule.scheduleId)

      const settlementAfter = db.settlement.findAll()
      expect(settlementBefore.paymentRequestId).toBeUndefined()
      expect(settlementAfter.paymentRequestId).toBeDefined() // acc value
    })

    test('return what I want', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res).toBe({ a: 2 })
    })
  })

  describe('when missing calculation to payment request', () => {
    beforeEach(async () => {
      await db.calculation.update({ paymentRequestId: null }, { where: { paymentRequestId } })
    })

    // app/processing/settlement/update-settlement-payment-request-id.js
    test('should update paymentRequestId for calculation', async () => {
      const calculationBefore = db.calculation.findAll()

      await getStatement(schedule.settlementId, schedule.scheduleId)

      const calculationAfter = db.calculation.findAll()
      expect(calculationBefore.paymentRequestId).toBeUndefined()
      expect(calculationAfter.paymentRequestId).toBeDefined() // acc value
    })

    test('return what I want', async () => {
      const res = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(res).toBe({ a: 2 })
    })
  })
})
