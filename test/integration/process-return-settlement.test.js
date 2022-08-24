const db = require('../../app/data')
const schemes = require('../../app/constants/schemes')

const processReturnSettlement = require('../../app/inbound/process-return-settlement')

let settlement
let paymentRequest

describe('process submit return settlement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    settlement = JSON.parse(JSON.stringify(require('../mock-settlement')))
    paymentRequest = JSON.parse(JSON.stringify(require('../mock-payment-request').processingPaymentRequest))

    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber: paymentRequest.invoiceNumber, originalInvoiceNumber: 'abcdef' })
    await db.paymentRequest.create(paymentRequest)
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

  test('should save entry into settlement table with frn of settlement.frn', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.frn).toBe(String(settlement.frn))
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
    settlement.settlementDate = new Date()
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.settlementDate).toStrictEqual(settlement.settlementDate)
  })

  test('should not save sourceSystem in the table when valid settlement received ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.sourceSystem).toBeUndefined()
  })
})
