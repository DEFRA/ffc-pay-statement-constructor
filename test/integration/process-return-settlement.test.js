const db = require('../../app/data')
const schemes = require('../../app/constants/schemes')

const processReturnSettlement = require('../../app/inbound/process-return-settlement')

let settlement
let paymentRequest

describe('process submit payment request', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))
    settlement = JSON.parse(JSON.stringify(require('../mock-settlement')))
    paymentRequest = JSON.parse(JSON.stringify(require('../mock-payment-request').paymentRequest))

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

  test('should save one entry into settlement table with frn of settlement.frn', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.count({ where: { frn: settlement.frn } })
    expect(result).toBe(1)
  })

  test('should save entry into settlement table with frn of settlement.frn', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { frn: settlement.frn } })
    expect(result).not.toBeNull()
  })

  test('should save one entry into settlement table with value of settlement.value', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.count({ where: { value: settlement.value } })
    expect(result).toBe(1)
  })

  test('should save entry into settlement table with value of settlement.value', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { value: settlement.value } })
    expect(result).not.toBeNull()
  })

  test('should save one entry into settlement table with reference of settlement.reference', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.count({ where: { reference: settlement.reference } })
    expect(result).toBe(1)
  })

  test('should save entry into settlement table with reference of settlement.reference', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { reference: settlement.reference } })
    expect(result).not.toBeNull()
  })

  test('should save one entry into settlement table with settlementDate of settlement.settlementDate', async () => {
    settlement.settlementDate = new Date()
    await processReturnSettlement(settlement)

    const result = await db.settlement.count({ where: { settlementDate: settlement.settlementDate } })
    expect(result).toBe(1)
  })

  test('should save entry into settlement table with settlementDate of settlement.settlementDate', async () => {
    settlement.settlementDate = new Date()
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { settlementDate: settlement.settlementDate } })
    expect(result).not.toBeNull()
  })

  test('should not save sourceSystem in the table when valid settlement received ', async () => {
    await processReturnSettlement(settlement)

    const result = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
    expect(result.dataValues.sourceSystem).toBe(undefined)
  })
})
