const db = require('../../app/data')
const schemes = require('../../app/constants/schemes')

const { SFI_FIRST_PAYMENT: invoiceNumber } = require('../mock-components/mock-invoice-number')
const { SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber } = require('../mock-components/mock-invoice-number')

const processReturnSettlement = require('../../app/inbound/return')

let settlement
let submitPaymentRequest, processingPaymentRequest

describe('process return settlement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    settlement = JSON.parse(JSON.stringify(require('../mock-objects/mock-settlement')))
    submitPaymentRequest = JSON.parse(JSON.stringify(require('../mock-objects/mock-payment-request').submitPaymentRequest))
    processingPaymentRequest = JSON.parse(JSON.stringify(require('../mock-objects/mock-payment-request').processingPaymentRequest))

    // input data into db
    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.create(submitPaymentRequest)
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

  test('should save entry into settlement table with invoiceNumber of settlement.invoiceNumber', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result).not.toBeNull()
  })

  test('should save one entry into settlement table with invoiceNumber of settlement.invoiceNumber', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.count({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result).toBe(1)
  })

  test('should save entry into settlement table with value of settlement.value', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.value).toBe(settlement.value)
  })

  test('should save entry into settlement table with reference of settlement.reference', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.reference).toBe(settlement.reference)
  })

  test('should save entry into settlement table with settlementDate of settlement.settlementDate', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.settlementDate).toStrictEqual(new Date(settlement.settlementDate))
  })

  test('should not save sourceSystem in the table when valid settlement received ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.sourceSystem).toBeUndefined()
  })

  test('should not save frn in the table when valid settlement received ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.frn).toBeUndefined()
  })

  test('should save settlement with paymentRequestId of paymentRequest.PaymentRequestId when matching paymentRequest with status of "Completed" is found ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.paymentRequestId).toBe(submitPaymentRequest.paymentRequestId)
  })

  test('should save settlement with paymentRequestId of null when paymentRequest table is empty ', async () => {
    const paymentRequestToRemove = await db.paymentRequest.findOne({ where: x => x.paymentRequestId === 1 })
    await paymentRequestToRemove.destroy()

    await processReturnSettlement(settlement)
    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.paymentRequestId).toBeNull()
  })

  test('should save settlement with paymentRequestId of null when no matching paymentRequest found', async () => {
    const paymentRequestToRemove = await db.paymentRequest.findOne({ where: x => x.paymentRequestId === 1 })
    await paymentRequestToRemove.destroy()
    await db.invoiceNumber.create({ invoiceNumber: 'S0000001SFIP000001V002', originalInvoiceNumber })
    submitPaymentRequest.invoiceNumber = 'S0000001SFIP000001V002'
    await db.paymentRequest.create(submitPaymentRequest)

    await processReturnSettlement(settlement)
    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.paymentRequestId).toBeNull()
  })

  test('should save settlement with paymentRequestId of null when paymentRequest has a status of "In progress"', async () => {
    const paymentRequestToRemove = await db.paymentRequest.findOne({ where: x => x.paymentRequestId === 1 })
    await paymentRequestToRemove.destroy()
    await db.paymentRequest.create(processingPaymentRequest)

    await processReturnSettlement(settlement)
    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.paymentRequestId).toBeNull()
  })
})
